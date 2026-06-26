# frozen_string_literal: true

require "minitest/autorun"
require "tmpdir"
require "fileutils"
require "stringio"
require_relative "../../lib/template_rename_command"

class TemplateRenameCommandTest < Minitest::Test
  def test_rewrites_web_template_files_for_valid_name
    Dir.mktmpdir("web-template-rename") do |tmpdir|
      write_fixture_files(tmpdir)
      command, stdout, stderr = build_command(argv: ["customer-portal-web"], root_path: tmpdir)

      command.run

      assert_equal "", stderr.string
      assert_includes stdout.string, "updated package.json"
      assert_includes stdout.string, "updated package-lock.json"
      assert_includes stdout.string, "updated config/seo.defaults.yml"
      assert_includes stdout.string, "updated pages/+config.ts"
      assert_includes stdout.string, "updated pages/+Layout.tsx"
      assert_includes stdout.string, "updated README.md"
      assert_includes stdout.string, "web template rename complete: customer-portal-web"

      assert_includes File.read(File.join(tmpdir, "package.json")), '"name": "customer-portal-web"'
      assert_includes File.read(File.join(tmpdir, "package-lock.json")), '"name": "customer-portal-web"'
      assert_includes File.read(File.join(tmpdir, "config/seo.defaults.yml")), "siteName: Customer Portal Web"
      assert_includes File.read(File.join(tmpdir, "config/seo.defaults.yml")), "defaultTitle: Customer Portal Web"
      assert_includes File.read(File.join(tmpdir, "pages/+config.ts")), 'title: "Customer Portal Web"'
      assert_includes File.read(File.join(tmpdir, "pages/+Layout.tsx")), "Customer Portal Web"
      assert_includes File.read(File.join(tmpdir, "README.md")), "# Customer Portal Web"
    end
  end

  def test_exits_with_usage_when_name_missing
    command, stdout, stderr = build_command(argv: [])

    error = assert_raises(SystemExit) { command.run }

    assert_equal 1, error.status
    assert_equal "", stdout.string
    assert_includes stderr.string, "Missing app name."
    assert_includes stderr.string, "Usage: bin/template_rename <new-app-name-kebab-case>"
  end

  def test_exits_with_usage_when_name_invalid
    command, stdout, stderr = build_command(argv: ["CustomerPortalWeb"])

    error = assert_raises(SystemExit) { command.run }

    assert_equal 1, error.status
    assert_equal "", stdout.string
    assert_includes stderr.string, "Invalid app name 'CustomerPortalWeb'. Expected kebab-case."
    assert_includes stderr.string, "Usage: bin/template_rename <new-app-name-kebab-case>"
  end

  def test_exits_when_template_has_already_been_renamed
    Dir.mktmpdir("web-template-already-renamed") do |tmpdir|
      write_fixture_files(tmpdir, package_name: "legacy-web")
      command, _stdout, stderr = build_command(argv: ["customer-portal-web"], root_path: tmpdir)

      error = assert_raises(SystemExit) { command.run }

      assert_equal 1, error.status
      assert_includes stderr.string, "This command only supports first rename from 'web-template'."
      assert_includes stderr.string, "Current app name is 'legacy-web'."
      assert_includes stderr.string, "Usage: bin/template_rename <new-app-name-kebab-case>"
    end
  end

  def test_exits_when_package_name_cannot_be_detected
    Dir.mktmpdir("web-template-missing-name") do |tmpdir|
      write_fixture_files(tmpdir)
      File.write(File.join(tmpdir, "package.json"), "{}\n")
      command, _stdout, stderr = build_command(argv: ["customer-portal-web"], root_path: tmpdir)

      error = assert_raises(SystemExit) { command.run }

      assert_equal 1, error.status
      assert_includes stderr.string, "Could not detect current app name from package.json."
      assert_includes stderr.string, "Usage: bin/template_rename <new-app-name-kebab-case>"
    end
  end

  def test_rewrite_file_only_logs_when_content_changes
    Dir.mktmpdir("web-template-rewrite-file") do |tmpdir|
      write_fixture_files(tmpdir)
      command, stdout, _stderr = build_command(root_path: tmpdir)

      command.send(:rewrite_file, "README.md") { |content| content }
      command.send(:rewrite_file, "README.md") { |content| content.sub("Generated", "Template") }

      refute_equal "", stdout.string
      assert_includes stdout.string, "updated README.md"
    end
  end

  def test_detect_current_app_name_reads_package_json
    Dir.mktmpdir("web-template-detect-name") do |tmpdir|
      write_fixture_files(tmpdir, package_name: "web-template")
      command, _stdout, _stderr = build_command(root_path: tmpdir)

      assert_equal "web-template", command.send(:detect_current_app_name)
    end
  end

  def test_warns_when_old_name_references_remain_outside_modified_files
    Dir.mktmpdir("web-template-remaining-refs") do |tmpdir|
      write_fixture_files(tmpdir)
      FileUtils.mkdir_p(File.join(tmpdir, "docs"))
      FileUtils.mkdir_p(File.join(tmpdir, "lib"))
      FileUtils.mkdir_p(File.join(tmpdir, "test/lib"))
      FileUtils.mkdir_p(File.join(tmpdir, "src"))
      File.write(File.join(tmpdir, "docs/manual_followup.txt"), "Legacy token: web-template\n")
      File.write(File.join(tmpdir, "lib/template_rename_command.rb"), "Legacy token: web-template\n")
      File.write(File.join(tmpdir, "test/lib/template_rename_command_test.rb"), "Legacy token: web-template\n")
      File.write(File.join(tmpdir, "src/manual_followup.txt"), "Legacy token: web-template\n")
      command, _stdout, stderr = build_command(argv: ["customer-portal-web"], root_path: tmpdir)

      command.run

      assert_includes stderr.string, "WARNING: Found remaining references to previous app name outside modified files."
      assert_includes stderr.string, "WARNING: src/manual_followup.txt"
      refute_includes stderr.string, "WARNING: docs/manual_followup.txt"
      refute_includes stderr.string, "WARNING: lib/template_rename_command.rb"
      refute_includes stderr.string, "WARNING: test/lib/template_rename_command_test.rb"
      refute_includes stderr.string, "WARNING: package.json"
      refute_includes stderr.string, "WARNING: package-lock.json"
      refute_includes stderr.string, "WARNING: config/seo.defaults.yml"
      refute_includes stderr.string, "WARNING: pages/+config.ts"
      refute_includes stderr.string, "WARNING: pages/+Layout.tsx"
      refute_includes stderr.string, "WARNING: README.md"
    end
  end

  private

  def build_command(argv: [], root_path: Dir.pwd)
    stdout = StringIO.new
    stderr = StringIO.new
    command = TemplateRenameCommand.new(argv: argv, stdout: stdout, stderr: stderr, root_path: root_path)
    [command, stdout, stderr]
  end

  def write_fixture_files(tmpdir, package_name: "web-template")
    FileUtils.mkdir_p(File.join(tmpdir, "pages"))
    FileUtils.mkdir_p(File.join(tmpdir, "config"))

    File.write(
      File.join(tmpdir, "package.json"),
      <<~JSON
        {
          "name": "#{package_name}",
          "type": "module"
        }
      JSON
    )

    File.write(
      File.join(tmpdir, "package-lock.json"),
      <<~JSON
        {
          "name": "#{package_name}",
          "packages": {
            "": {
              "name": "#{package_name}"
            }
          }
        }
      JSON
    )

    File.write(
      File.join(tmpdir, "pages/+config.ts"),
      <<~TS
        export default {
          title: "Northline Web Template"
        }
      TS
    )

    File.write(
      File.join(tmpdir, "config/seo.defaults.yml"),
      <<~YML
        siteName: Northline Web Template
        siteUrl: https://example.com
        defaultTitle: Northline Web Template
        defaultDescription: Web starter with Rails auth flows and SEO-ready static pages.
      YML
    )

    File.write(
      File.join(tmpdir, "pages/+Layout.tsx"),
      <<~TSX
        <span className="brand-text">Northline Web Template</span>
      TSX
    )

    File.write(
      File.join(tmpdir, "README.md"),
      <<~MD
        Generated project docs.
      MD
    )
  end
end
