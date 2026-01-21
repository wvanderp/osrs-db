import { Formatter, FracturedJsonOptions, EolStyle } from "fracturedjsonjs";

/**
 * Creates a FracturedJson formatter with consistent settings for the project.
 * FracturedJson produces human-readable output with smart line breaks and table alignment.
 */
function createFormatter(): Formatter {
  const options = new FracturedJsonOptions();

  // Set reasonable defaults for this project
  options.MaxTotalLineLength = 120;
  options.MaxInlineComplexity = 1;
  options.JsonEolStyle = EolStyle.Lf;
  options.IndentSpaces = 2;

  const formatter = new Formatter();
  formatter.Options = options;

  return formatter;
}

// Singleton formatter instance for performance
let formatterInstance: Formatter | null = null;

function getFormatter(): Formatter {
  if (!formatterInstance) {
    formatterInstance = createFormatter();
  }
  return formatterInstance;
}

/**
 * Formats a JavaScript object to a JSON string using FracturedJson.
 * Produces human-readable output with smart line breaks and table alignment.
 *
 * @param data - The data to serialize to JSON
 * @returns Formatted JSON string
 */
export function formatJson(data: unknown): string {
  const formatter = getFormatter();
  const result = formatter.Serialize(data);
  if (result === undefined) {
    throw new Error("FracturedJson failed to serialize data");
  }
  return result;
}

/**
 * Reformats an existing JSON string using FracturedJson.
 * Useful for reformatting JSON files that may have inconsistent formatting.
 *
 * @param json - The JSON string to reformat
 * @returns Formatted JSON string
 */
export function reformatJson(json: string): string {
  const formatter = getFormatter();
  const result = formatter.Reformat(json);
  if (result === undefined) {
    throw new Error("FracturedJson failed to reformat JSON");
  }
  return result;
}

export default formatJson;
