/**
 * @description
 * This file stores constant values used throughout the MeetingWeaver AI application.
 * Centralizing constants improves maintainability and reduces magic strings/numbers.
 *
 * Key constants:
 * - LocalStorage Keys: For persisting application state.
 * - Text Separators: Standardized strings used for navigation and content splitting.
 * - Templates: Predefined text structures for modals and prompt generation.
 *
 * @dependencies
 * - None
 *
 * @notes
 * - Keep constants organized and clearly named.
 */

// LocalStorage Keys
export const LS_CONTEXT_KEY = "meetingweaver_context";
export const LS_SLIDE_NOTES_KEY = "meetingweaver_slide_notes";
export const LS_TRANSCRIPT_DISPLAY_KEY = "meetingweaver_transcript_display";
export const LS_TRANSCRIPT_ORIGINAL_KEY = "meetingweaver_transcript_original";

// Text Separators & Prefixes
/**
 * @description Separator used in the Slide/Meeting Notes text area. Also used in transcript context lines.
 */
export const SLIDE_NOTES_SEPARATOR = "##########";
/**
 * @description Prefix used for context lines added within the Meeting Transcript text area.
 */
export const TRANSCRIPT_CONTEXT_PREFIX = "## ";

// Templates
/**
 * @description Default template pre-populated in the Project & Company Context modal.
 * Loaded from markdown file for better maintainability.
 */
export const CONTEXT_TEMPLATE = `# Meeting Name

# Company Context

# Our Team in the meeting

# Client Team in the meeting

# Meeting Agenda - We don't always get to all the topics

# Nuance & Extra Context`;

/**
 * @description Template used for generating the final Note Builder Prompt.
 * Placeholders (<PLACEHOLDER_NAME>) will be replaced with actual content.
 * Loaded from markdown file for better maintainability.
 */
export const PROMPT_TEMPLATE = `Assume the role of detailed meeting note taker and trade promotion management software consultant.

I will  feed you the following information about my company and today's meeting under the following headers and I want you to ask any clarifying follow up questions to get better context.

Once receiving answers please sift through banter and provide a detailed, comprehensive set of notes on today's meeting in the following output format:

# Action Items (Client)

# Action Items (Our Team)

# Circle Back Items

# Full Detailed Meeting Notes

###########################################################################################################################################################

# Project/Company/Client Context

<PROJECT_COMPANY_CONTEXT>

# Slide Notes

<SLIDE_NOTES>

###########################################################################################################################################################

#Meeting Transcript

<MEETING_TRANSCRIPT>`;
