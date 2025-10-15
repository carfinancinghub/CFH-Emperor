// File name: AuctionTemplateEngine.ts
// 
// File Path: @services/auction/AuctionTemplateEngine.ts

import logger from "@/utils/logger";
import { saveTemplateSchema, templateIdSchema, AuctionTemplate } from "@/validation/auctionSchemas";

const templates: Record<string, AuctionTemplate & { sellerId: string }> = {};

export function saveTemplate(sellerId: string, template: AuctionTemplate): string | null {
  try {
    saveTemplateSchema.parse({ sellerId, template });
    const templateId = `${sellerId}-${Date.now()}`;
    templates[templateId] = { ...template, sellerId };
    return templateId;
  } catch (error) {
    logger.error(`saveTemplate validation/logic error: ${String(error)}`);
    return null;
  }
}

export function getTemplate(templateId: string): (AuctionTemplate & { sellerId: string }) | null {
  try {
    templateIdSchema.parse({ templateId });
    return templates[templateId] ?? null;
  } catch (error) {
    logger.error(`getTemplate validation/logic error: ${String(error)}`);
    return null;
  }
}
