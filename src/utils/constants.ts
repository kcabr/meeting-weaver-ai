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
export const SLIDE_NOTES_SEPARATOR =
  "#########################################";
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
export const PROMPT_TEMPLATE_DESIGN = `Assume the role of detailed meeting note taker and trade promotion management software consultant.

###########################################################################################################################################################

I will feed you information about my company (Xtel, created software also called Xtel) under the following headers

# Meeting Name

# Our Company Context

# Client Context

# Our Team in the meeting

# Client Team in the meeting

# Meeting Agenda - We don't always get to all the topics

# Nuance & Extra Context

# Slide Notes

###########################################################################################################################################################

Below the slide notes will begin the meeting transcript. Consume everything for the best context. 
Before you build and respond with meeting notes I want you to ask any clarifying follow up questions to get better context.

Analyze the provided meeting transcript. Extract key decisions, action items (with owners and deadlines if mentioned), and major discussion points. Exclude off-topic chatter and filler conversation. 

The final output should match this format:

# Action Items (Client)

# Action Items (US)

# Circle Back Items

# Full Detailed Meeting Notes

## Full Detailed Meeting Notes Format ##########################################################################################################################

This is a design meeting. Below is an example of the format I would like for the Full Detailed Meeting Notes. You discuss the Presentation then review client input & discussion.:

**4. Accruals**
*   **Xtel Presentation (Kevin G., Doug S.):**
    *   **Decision Point:** Will accruals be calculated in Xtel or JDE?
    *   **Xtel Methodology (Event-Based / Bottom-Up):**
        *   Xtel calculates financial accruals (liability booking) at the event/promotion level based on defined rules, *not* based on a top-down fund generation percentage. This contrasts with Post's current method.
        *   Accruals reflect actual event spend based on actual shipments (or other defined drivers). Goal is a more accurate monthly liability figure compared to a blended rate approach.
        *   This method should result in smaller month-to-month swings/adjustments ("true-ups") compared to a fund-based accrual.
        *   **Crucial Distinction:** Financial Accrual (liability owed, discussed here) vs. Sales Accrual (funding generated/earned for checkbooks, handled separately in funding module). Sales users *can* see the financial accrual amount related to their events if needed.
    *   **Accrual Behavior Rules (Configurable per Tactic/Mechanic):**
        *   **Trigger:** When does accrual calculation start? (Do Not Accrue, Event Start Month/Period, Event Actuals Start). OI tactics often set to "Do Not Accrue."
        *   **Posting Dates:** Which dates drive the posting period? (Sell-in/Shipment Dates, Sell-out/Consumption Dates). Most clients tie accruals to Shipment dates for accounting alignment.
        *   **Calculation Base:** What spend value is used? (Forecasted Spend, Actual Spend, LE Spend). Lump sums often use Forecast; rate-based often use LE. Actual Spend can also be used.
        *   **Proration:** If accruing only a portion of multi-period spend, how is it prorated? (No Prorate/Full Amount, Prorate by Days in Month/Period, Weekly Split, etc.). Lump sums often use "No Prorate" in the first month.
    *   Xtel provides 9 standard pre-configured behavior combinations (e.g., Behavior_04 for lump sums: Accrue on Event Start Month, use Forecast Spend, post on Sell-in Dates, No Prorate). New combinations can be configured if needed.
    *   Accrual values (based on LE/Actuals) update daily as underlying data changes.
    *   Accrual amounts are visible within the event screen at the product/tactic level.
    *   **Handling Paid Amounts:** Discussion point for requirements: Does the final accrual value subtract paid amounts (liability remaining = 0), or does it reflect the total earned/paid amount (liability = paid amount)?
*   **Client Input & Discussion (Amy L., Mike K., Conference Room):**
    *   **Decision:** Confirmed accruals *will* be calculated in Xtel.
    *   **Current Process:** Post currently accrues based on total shipments * LE volume * blended rate (fund-based/top-down). They use a "guardrail" method based on total company sales/spend rates because the current system isn't accurate enough for liability.
    *   Acknowledged the shift to event-based accrual is a **major change** for Finance. Requires further internal discussion and a dedicated deep-dive session with Xtel. Action Item for Finance.
    *   Clarified understanding that "Mechanic" in Xtel context refers to the Tactic (e.g., Off Invoice, Lump Sum, Scan). Accrual rules are generally consistent across customers for the same tactic.
    *   Confirmed Sales team primarily cares about fund generation ("deposit"), not the detailed financial liability accrual, though visibility is available.
    *   Question raised about handling ship dates for accruals when shipments occur earlier than planned event ship dates (e.g., April 27th ship for May 1st event start). Xtel explained accrual follows event dates; adjustments might involve changing event dates or potentially creating short secondary events (needs more discussion in requirements). Using LE spend calculation might mitigate some timing issues if volume forecasts are accurate.


## MEETING CONTEXT/NOTES START ####################################################################################################################################

<PROJECT_COMPANY_CONTEXT>

# Slide Notes

<SLIDE_NOTES>

###########################################################################################################################################################

# Meeting Transcript - I will use #s to add context within the transcript and to explain when we are moving on to another section.

<MEETING_TRANSCRIPT>`;

export const PROMPT_TEMPLATE_TRAINING = `Assume the role of detailed meeting note taker and trade promotion management software consultant.

###########################################################################################################################################################

I will feed you information about my company (Xtel, created software also called Xtel) under the following headers

# Meeting Name

# Our Company Context

# Client Context

# Our Team in the meeting

# Client Team in the meeting

# Meeting Agenda - We don't always get to all the topics

# Nuance & Extra Context

# Slide Notes

###########################################################################################################################################################

Below the slide notes will begin the meeting transcript. Consume everything for the best context. 
Before you build and respond with meeting notes I want you to ask any clarifying follow up questions to get better context.

Analyze the provided meeting transcript. Extract key decisions, action items (with owners and deadlines if mentioned), and major discussion points. Exclude off-topic chatter and filler conversation. 

The final output should match this format:

# Action Items (Client)

# Action Items (US)

# Open Questions / Circle Back Items

# Bugs / Issues found in system during training

# Full Detailed Meeting Notes

## Full Detailed Meeting Notes Format ##########################################################################################################################

This is a training session. You don't need to take fully detailed notes on what we are saying. A summary of the training portion is all that is needed. 

I am more interested in the client's feedback and questions.

Break up the meeting into sections. Below is an example of the format for a section that I would like for the Full Detailed Meeting Notes. You discuss the Presentation then review client input & discussion.:

**4. Accruals**
*   **Xtel Presentation (Kevin G., Doug S.):**
    *   **Training Summary:** Slightly detailed accruals training summary here
    *   **Bugs / Issues found in system during training:** Bugs / Issues found in system during training here
*   **Client Input & Discussion (Amy L., Mike K., Conference Room):**
    *   **Decision:** Confirmed accruals *will* be calculated in Xtel.
    *   **Current Process:** Post currently accrues based on total shipments * LE volume * blended rate (fund-based/top-down). They use a "guardrail" method based on total company sales/spend rates because the current system isn't accurate enough for liability.
    *   Acknowledged the shift to event-based accrual is a **major change** for Finance. Requires further internal discussion and a dedicated deep-dive session with Xtel. Action Item for Finance.
    *   Clarified understanding that "Mechanic" in Xtel context refers to the Tactic (e.g., Off Invoice, Lump Sum, Scan). Accrual rules are generally consistent across customers for the same tactic.
    *   Confirmed Sales team primarily cares about fund generation ("deposit"), not the detailed financial liability accrual, though visibility is available.
    *   Question raised about handling ship dates for accruals when shipments occur earlier than planned event ship dates (e.g., April 27th ship for May 1st event start). Xtel explained accrual follows event dates; adjustments might involve changing event dates or potentially creating short secondary events (needs more discussion in requirements). Using LE spend calculation might mitigate some timing issues if volume forecasts are accurate.


## MEETING CONTEXT/NOTES START ####################################################################################################################################

<PROJECT_COMPANY_CONTEXT>

# Slide Notes

<SLIDE_NOTES>

###########################################################################################################################################################

# Meeting Transcript - I will use #s to add context within the transcript and to explain when we are moving on to another section.

<MEETING_TRANSCRIPT>`;
