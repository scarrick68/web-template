# frozen_string_literal: true

# Renames web-template internals to a new web app name.
class TemplateRenameCommand
  MODIFIED_RENAME_PATHS = [
    "package.json",
    "package-lock.json",
    "pages/+config.ts",
    "pages/+Layout.tsx",
    "README.md"
  ].freeze

  def initialize(argv: ARGV, stdout: $stdout, stderr: $stderr, root_path: Dir.pwd)
    @argv = argv
    @stdout = stdout
    @stderr = stderr
    @root_path = root_path
  end

  def run
    new_name = parse_new_name
    current_name = detect_current_app_name
    ensure_template_baseline!(current_name)

    product_name = new_name.sub(/-web\z/, "")
    ui_title = "#{titleize(product_name)} Web"

    rename_in_package_json(new_name)
    rename_in_package_lock_json(new_name)
    rename_in_pages_config_ts(ui_title)
    rename_in_pages_layout_tsx(ui_title)
    rename_in_readme(ui_title)
    warn_on_remaining_references(old_name: current_name)

    @stdout.puts("web template rename complete: #{new_name}")
  end

  private

  def parse_new_name
    new_name = @argv[0].to_s.strip
    abort_with_usage("Missing app name.") if new_name.empty?

    validate_name!(new_name)
    new_name
  end

  def validate_name!(name)
    return if name.match?(/\A[a-z0-9]+(?:-[a-z0-9]+)*\z/)

    abort_with_usage("Invalid app name '#{name}'. Expected kebab-case.")
  end

  def detect_current_app_name
    package_path = File.join(@root_path, "package.json")
    return nil unless File.exist?(package_path)

    content = File.read(package_path)
    content[/"name"\s*:\s*"([^"]+)"/, 1]
  end

  def ensure_template_baseline!(current_name)
    return if current_name == "web-template"

    if current_name.nil? || current_name.empty?
      abort_with_usage("Could not detect current app name from package.json.")
    end

    abort_with_usage(
      "This command only supports first rename from 'web-template'. Current app name is '#{current_name}'."
    )
  end

  def titleize(value)
    value.split("-").map { |part| part.capitalize }.join(" ")
  end

  def rename_in_package_json(new_name)
    rewrite_file("package.json") do |content|
      content.sub(/("name"\s*:\s*")[^"]+("\s*,?)/, "\\1#{new_name}\\2")
    end
  end

  def rename_in_package_lock_json(new_name)
    rewrite_file("package-lock.json") do |content|
      content.gsub(/("name"\s*:\s*")web-template("\s*,?)/, "\\1#{new_name}\\2")
    end
  end

  def rename_in_pages_config_ts(ui_title)
    rewrite_file("pages/+config.ts") do |content|
      content.sub(/(title:\s*")[^"]+(")/, "\\1#{ui_title}\\2")
    end
  end

  def rename_in_pages_layout_tsx(ui_title)
    rewrite_file("pages/+Layout.tsx") do |content|
      content.sub(/(<span className=\"brand-text\">)[^<]+(<\/span>)/, "\\1#{ui_title}\\2")
    end
  end

  def rename_in_readme(ui_title)
    rewrite_file("README.md") do |content|
      if content.start_with?("# ")
        content.sub(/^#\s+.*$/, "# #{ui_title}")
      else
        "# #{ui_title}\n\n#{content}"
      end
    end
  end

  def warn_on_remaining_references(old_name:)
    matches = remaining_reference_matches(old_name)
    return if matches.empty?

    @stderr.puts("WARNING: Found remaining references to previous app name outside modified files.")
    @stderr.puts("WARNING: Review and update these paths manually if needed.")
    matches.each { |path| @stderr.puts("WARNING: #{path}") }
  end

  def remaining_reference_matches(old_name)
    Dir.glob(File.join(@root_path, "**/*"), File::FNM_DOTMATCH).filter_map do |absolute_path|
      next unless File.file?(absolute_path)

      relative_path = absolute_path.delete_prefix("#{@root_path}/")
      next if skip_reference_scan_path?(relative_path)

      content = File.read(absolute_path)
      next unless content.include?(old_name)

      relative_path
    rescue ArgumentError
      # Ignore binary or invalid-encoding files.
      next
    end.sort
  end

  def skip_reference_scan_path?(relative_path)
    return true if MODIFIED_RENAME_PATHS.include?(relative_path)

    relative_path.start_with?(".git/") ||
      relative_path.start_with?("node_modules/") ||
      relative_path.start_with?("dist/") ||
      relative_path.start_with?("tmp/") ||
      relative_path.start_with?("coverage/")
  end

  def rewrite_file(path)
    absolute_path = File.join(@root_path, path)
    return unless File.exist?(absolute_path)

    original = File.read(absolute_path)
    updated = yield(original.dup)
    return if updated == original

    File.write(absolute_path, updated)
    @stdout.puts("updated #{path}")
  end

  def abort_with_usage(message)
    @stderr.puts(message)
    @stderr.puts("Usage: bin/template_rename <new-app-name-kebab-case>")
    exit 1
  end
end

if $PROGRAM_NAME == __FILE__
  TemplateRenameCommand.new.run
end
