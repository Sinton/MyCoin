package main

import (
	"embed"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
	"text/template"

	"github.com/AlecAivazis/survey/v2"
	"github.com/go-git/go-git/v5"
	"github.com/spf13/cobra"
)

//go:embed templates/*.tmpl
var templateFS embed.FS

const (
	// Default template repository
	DefaultTemplateURL = "https://github.com/l0101/my-coin-api"
	// The placeholder module name in the template
	TemplateModule  = "github.com/Sinton/my-coin-api"
	TemplateProject = "my-coin-api"
)

// AppConfig stores the configuration for a specific tenant application
type AppConfig struct {
	AppName  string
	BundleID string
	KeyID    string
	IssuerID string
	Port     string
	DBName   string
}

var rootCmd = &cobra.Command{
	Use:   "mycoin-cli",
	Short: "🚀 MyCoin Engineering Toolkit - Standardize your IAP services",
}

var createCmd = &cobra.Command{
	Use:   "create",
	Short: "Create a new IAP service from template",
	Run: func(cmd *cobra.Command, args []string) {
		var config struct {
			ProjectName string
			ModulePath  string
			TemplateURL string
		}

		// 1. Interactive questions
		if err := survey.AskOne(&survey.Input{
			Message: "New Project Name:",
			Default: "my-app",
		}, &config.ProjectName, survey.WithValidator(survey.Required)); err != nil {
			return
		}

		if err := survey.AskOne(&survey.Input{
			Message: "Go Module Path:",
			Default: fmt.Sprintf("github.com/l0101/%s", config.ProjectName),
		}, &config.ModulePath, survey.WithValidator(survey.Required)); err != nil {
			return
		}

		if err := survey.AskOne(&survey.Input{
			Message: "Template Repository URL:",
			Default: DefaultTemplateURL,
		}, &config.TemplateURL, survey.WithValidator(survey.Required)); err != nil {
			return
		}

		fmt.Printf("\n🏗️  Cloning template from %s...\n", config.TemplateURL)

		// 2. Clone to target directory
		_, err := git.PlainClone(config.ProjectName, false, &git.CloneOptions{
			URL:      config.TemplateURL,
			Progress: os.Stdout,
		})
		if err != nil {
			fmt.Printf("❌ Failed to clone template: %v\n", err)
			return
		}

		// 3. Remove .git from the new project
		os.RemoveAll(filepath.Join(config.ProjectName, ".git"))

		fmt.Println("✨ Template cloned. Applying customizations...")

		// 4. Execute replacement engine
		err = processFiles(config.ProjectName, TemplateModule, config.ModulePath, TemplateProject, config.ProjectName)
		if err != nil {
			fmt.Printf("❌ Customization failed: %v\n", err)
			return
		}

		fmt.Printf("\n🎉 Project %s created successfully!\n", config.ProjectName)
		fmt.Printf("👉 cd %s && go mod tidy\n", config.ProjectName)
	},
}

func processFiles(target, oldModule, newModule, oldProject, newProject string) error {
	return filepath.WalkDir(target, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}

		// Skip unnecessary folders
		skipDirs := []string{"bin", "dist", ".idea", ".vscode", "temp"}
		for _, s := range skipDirs {
			if d.IsDir() && d.Name() == s {
				return filepath.SkipDir
			}
		}

		// Smart Docs Handling: Only keep README.md in docs
		if strings.Contains(path, "docs") && !strings.HasSuffix(path, "docs") {
			if !strings.HasSuffix(path, "README.md") && !d.IsDir() {
				return os.Remove(path) // Directly delete unnecessary docs
			}
		}

		if d.IsDir() {
			return nil
		}

		// Process content replacement
		ext := filepath.Ext(path)
		relevantExts := map[string]bool{
			".go": true, ".mod": true, ".yaml": true, ".yml": true, ".tmpl": true, ".md": true,
		}
		
		isDockerfile := strings.Contains(filepath.Base(path), "Dockerfile")

		if relevantExts[ext] || isDockerfile {
			data, err := os.ReadFile(path)
			if err != nil {
				return err
			}
			content := string(data)
			content = strings.ReplaceAll(content, oldModule, newModule)
			content = strings.ReplaceAll(content, oldProject, newProject)
			return os.WriteFile(path, []byte(content), 0644)
		}

		return nil
	})
}

// Init command
var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Initialize a new application instance configuration",
	Run: func(cmd *cobra.Command, args []string) {
		config := AppConfig{}
		var qs = []*survey.Question{
			{
				Name:     "appName",
				Prompt:   &survey.Input{Message: "App Name (e.g. mysleep):", Default: "myapp"},
				Validate: survey.Required,
			},
			{
				Name:     "bundleID",
				Prompt:   &survey.Input{Message: "Bundle ID (e.g. com.l0101.mysleep):"},
				Validate: survey.Required,
			},
			{
				Name:     "keyID",
				Prompt:   &survey.Input{Message: "Apple Key ID (10 chars):"},
				Validate: survey.MaxLength(10),
			},
			{
				Name:     "issuerID",
				Prompt:   &survey.Input{Message: "Apple Issuer ID (UUID):"},
				Validate: survey.Required,
			},
			{
				Name:     "port",
				Prompt:   &survey.Input{Message: "Public Port:", Default: "8080"},
				Validate: survey.Required,
			},
		}

		if err := survey.Ask(qs, &config); err != nil {
			return
		}

		config.DBName = config.AppName + "_db"
		fileName := fmt.Sprintf("docker-compose.%s.yml", config.AppName)
		f, err := os.Create(fileName)
		if err != nil {
			fmt.Printf("❌ Failed to create file: %v\n", err)
			return
		}
		defer f.Close()

		tmpl, err := template.ParseFS(templateFS, "templates/docker-compose.yml.tmpl")
		if err != nil {
			fmt.Printf("❌ Failed to parse embedded template: %v\n", err)
			return
		}

		err = tmpl.Execute(f, config)
		if err != nil {
			fmt.Printf("❌ Template execution failed: %v\n", err)
			return
		}

		fmt.Printf("\n✨ Successfully initialized %s!\n", config.AppName)
		fmt.Printf("📂 Created: %s\n", fileName)
	},
}

func main() {
	rootCmd.AddCommand(createCmd)
	rootCmd.AddCommand(initCmd)
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
