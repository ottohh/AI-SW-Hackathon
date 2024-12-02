import { z } from "zod";

export const dublinCoreSchema = z.object({
  title: z.string().describe("A name given to the resource."),
  creator: z
    .string()
    .optional()
    .describe("An entity primarily responsible for making the resource."),
  subject: z.string().optional().describe("The topic of the resource."),
  description: z.string().optional().describe("An account of the resource."),
  publisher: z
    .string()
    .optional()
    .describe("An entity responsible for making the resource available."),
  contributor: z
    .string()
    .optional()
    .describe(
      "An entity responsible for making contributions to the resource."
    ),
  date: z
    .string()
    .optional()
    .describe(
      "A point or period of time associated with an event in the lifecycle of the resource."
    ),
  type: z.string().optional().describe("The nature or genre of the resource."),
  format: z
    .string()
    .optional()
    .describe(
      "The file format, physical medium, or dimensions of the resource."
    ),
  identifier: z
    .string()
    .optional()
    .describe(
      "An unambiguous reference to the resource within a given context."
    ),
  source: z
    .string()
    .optional()
    .describe(
      "A related resource from which the described resource is derived."
    ),
  language: z.string().optional().describe("A language of the resource."),
  relation: z.string().optional().describe("A related resource."),
  coverage: z
    .string()
    .optional()
    .describe(
      "The spatial or temporal topic of the resource, spatial applicability, or jurisdiction."
    ),
  rights: z
    .string()
    .optional()
    .describe("Information about rights held in and over the resource."),
});

export type DublinCoreMetadata = z.infer<typeof dublinCoreSchema>;
