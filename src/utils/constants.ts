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

# Action Items (US - Xtel)

# Open Questions / Circle Back Items

# Full Detailed Meeting Notes

## Full Detailed Meeting Notes Format ##########################################################################################################################

This is a training session. You don't need to take fully detailed notes on what we are saying. A summary of the training portion is all that is needed. 

I am more interested in the client's feedback, questions, and issues as well as system issues occuring during the demo.

Break up the meeting into sections. Below is an example of the format for a section that I would like for the Full Detailed Meeting Notes. You discuss the Presentation then review client input & discussion.:

## 1. Section Name
**Xtel-Led Training & System Interaction:**
*   **Training Summary & Key Areas Covered:**
    *   [Briefly state the main objectives for the session (e.g., "Focused on promotion creation, budget allocation, and approval workflows."). Then, list the key modules/features demonstrated and practiced (e.g., "Covered: Navigating promotion setup, inputting mandatory fields, product selection, budget allocation to promotions, and initiating the approval process."). Mention any significant client engagement or successful practice if it's a key takeaway, e.g., "Clients successfully created several test promotions."].
*   **Bugs / Issues Identified in System During Training:**
    *   [e.g., System became unresponsive when selecting over 50 products for a promotion.]
    *   [e.g., Typo ("Aproval") found on the 'Budget Summary' screen.]
    *   [e.g., Filter for 'Promotion Type' did not correctly apply in one instance.]
    *   *(List each distinct bug/issue observed as a concise point.)*

**Client Input & Discussion ([List key client participants if different from main attendees list, or re-iterate e.g., Amy L., Mike K.]):**
*   **General Feedback:**
    *   [Summarize client's overall impressions of the software shown (e.g., "Positive feedback on the UI intuitiveness compared to old system.") and any suggestions for system improvements (non-bugs) (e.g., "Requested YTD spend visibility on budget allocation screen."). Include feedback on the training delivery itself (e.g., "Appreciated the hands-on approach; requested a quick reference guide for icons.").
*   **Client Struggles/Areas of Confusion:** *(Ignore this section if no notable issues)*
    *   [e.g., Initial confusion differentiating 'Planned Uplift' vs. 'Actual Uplift' fields, requiring further explanation.]
    *   [e.g., Some difficulty remembering the exact sequence for linking child promotions without guidance.]
*   **Other Client Comments & Questions:**
    *   [e.g., Q: "Can approval workflows be customized?" (Xtel: Yes, configurable / admin training).]
    *   [e.g., Q: "How are exchange rates handled for international promotions?" (Xtel: Daily pull, manual override possible).]
    *   [e.g., Feature request: Dashboard widget for top 5 performing promotions by ROI.]
    *   [e.g., Inquiry about integration possibilities with [Client's Other Tool Name].]

## MEETING CONTEXT/NOTES START ####################################################################################################################################

<PROJECT_COMPANY_CONTEXT>

# Slide Notes

<SLIDE_NOTES>

###########################################################################################################################################################

<MEETING_TRANSCRIPT>`;

export const PROMPT_TEMPLATE_GENERAL_CLIENT = `Assume the role of detailed meeting note taker and trade promotion management software consultant.

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

This is a general meeting with the client.  

I am interested in the general discussion, client's feedback, questions, action items and general dynamic and sentiment analysis of the meeting.

Below is an example of the output format for the Full Detailed Meeting Notes:

## Full Detailed Meeting Notes Format ##########################################################################################################################

**Meeting Purpose/Objective(s):**
*   [e.g., To discuss Q2 performance and plan Q3 initiatives.]
*   [e.g., To gather feedback on the latest prototype and address outstanding questions.]
*   [e.g., General project update and alignment on next steps.]

# General Back and Forth Dynamic / Feel / Sentiment Analysis

# Summary of Client Conflict / Disagreement / Concerns / Issues

---

**1. Overall Meeting Summary & Key Outcomes:**
*   [Provide a 2-3 sentence high-level overview of the meeting's flow, main achievements, and any critical decisions or roadblocks. This is the "executive summary" of the meeting.]
*   [e.g., Productive discussion focused on X and Y. Client provided positive feedback on Z, raised concerns about A. Key decisions included B. Next steps involve C.]

---

**2. Key Discussion Topics & Client Interaction:**

    *(Repeat this section for each major topic covered. The example you provided for "Xtel-Led Training & System Interaction" can be adapted for any topic, like "Project Roadmap Review," "Marketing Campaign Performance," "New Feature Proposal," etc.)*

    ---
    **2.1. Topic: [Specific Name of the Discussion Point, e.g., "Review of Q2 Sales Performance Dashboard"]**

    *   **A. Topic Presentation & Key Information Shared (Our Side):**
        *   **Objectives for this Topic:** [e.g., "To present the new Q2 sales dashboard and explain key metrics.", "To walk through the proposed solution for issue X."]
        *   **Key Points Covered/Demonstrated:**
            *   [e.g., "Showcased new filtering capabilities on the dashboard."]
            *   [e.g., "Highlighted 15% growth in region Y."]
            *   [e.g., "Explained the three phases of the proposed feature rollout."]
        *   **Issues/Observations During Presentation (if applicable):**
            *   [e.g., "Minor lag observed when loading the 'All Products' view on the demo dashboard."]
            *   [e.g., "Realized a data point for 'Market Share' was missing from the presentation slide."]

    *   **B. Client Input & Discussion on this Topic:**
        *   **Key Client Participants for this Topic:** [List if specific individuals drove the discussion, e.g., "Sarah (Marketing Lead), John (Sales Ops)"]
        *   **General Feedback & Reactions:**
            *   [e.g., "Client expressed enthusiasm for the improved UI of the dashboard."]
            *   [e.g., "They found the phased rollout approach sensible but had questions about timelines."]
            *   [e.g., "Requested clarification on how metric X was calculated."]
        *   **Client Questions & Our Responses:**
            *   **Q:** "[Client's exact or paraphrased question]" (Asked by: [Client Name, if notable])
            *   **A:** "[Our team's response, key points made]" (Answered by: [Our Team Member])
            *   **Q:** "[Another question]"
            *   **A:** "[Response]"
        *   **Client Concerns / Points of Confusion / Areas of Disagreement:**
            *   [e.g., "Initial confusion regarding the term 'Projected Uplift'; required further explanation."]
            *   [e.g., "Concern raised about the resource implications for Phase 2 of the rollout."]
            *   [e.g., "Disagreement on the priority of feature Y versus feature Z."]
        *   **Client Suggestions / Requests / Ideas:**
            *   [e.g., "Suggested adding a 'YTD Comparison' view to the dashboard."]
            *   [e.g., "Requested a follow-up session specifically on the technical architecture."]
            *   [e.g., "Inquired about potential integration with their CRM system."]

    ---
    **2.2. Topic: [Next Discussion Point, e.g., "Planning for Q3 Marketing Campaign"]**
    *   **A. Topic Presentation & Key Information Shared (Our Side):**
        *   ...
    *   **B. Client Input & Discussion on this Topic:**
        *   ...
    ---
    *(Continue for all significant topics)*

---

**3. General Client Feedback & Open Discussion (Not tied to a specific topic above):**
*   [e.g., Client appreciated the collaborative approach of the meeting.]
*   [e.g., General questions about overall project timelines or budget not covered elsewhere.]
*   [e.g., Feedback on the communication frequency.]

---

**4. Decisions Made:**
*   **Decision 1:** [e.g., To proceed with Option A for the new feature design.] (Rationale: [Brief reason])
*   **Decision 2:** [e.g., Postpone discussion on X until more data is available.]
*   [If no decisions were made, state "No formal decisions made in this meeting."]

---

**5. Action Items:**
| # | Action Item                                      | Owner(s)         | Due Date     | Status      | Notes                                     |
|---|--------------------------------------------------|------------------|--------------|-------------|-------------------------------------------|
| 1 | [e.g., Send revised project timeline to client]  | [Your Team Name] | [YYYY-MM-DD] | Open        |                                           |
| 2 | [e.g., Client to provide feedback on proposal X] | [Client Name]    | [YYYY-MM-DD] | Open        |                                           |
| 3 | [e.g., Schedule follow-up technical deep-dive]   | [Your Team Name] | [YYYY-MM-DD] | Open        | Coordinate with Client's technical lead |
|   |                                                  |                  |              |             |                                           |

---

**6. Meeting Dynamics & Sentiment Analysis:**
*   **Overall Client Sentiment:** [e.g., Positive, Generally Positive with some concerns, Neutral, Cautious, Mixed, Negative – briefly explain why.]
    *   [e.g., "Client seemed very receptive to the new dashboard, but cautious about the aggressive timeline for the Q3 campaign."]
*   **Engagement Levels:**
    *   **Client:** [e.g., Highly engaged, actively participated, some members quiet, mainly listening]
    *   **Our Team:** [e.g., Proactive in leading discussion, responsive to questions]
*   **Key Observations on Group Dynamics:**
    *   [e.g., Good rapport between teams.]
    *   [e.g., [Client Name A] seemed to be the primary decision-maker/influencer for the client.]
    *   [e.g., Some tension observed when discussing budget constraints.]
    *   [e.g., Client team seemed aligned internally / Client team had differing opinions on X.]
*   **Any Unspoken Concerns or Undercurrents Noted:**
    *   [e.g., "Felt like the client might be under internal pressure regarding budget, though not explicitly stated."]
    *   [e.g., "Slight hesitation from client when discussing data migration – might need to probe further."]
*   **Meeting Effectiveness:**
    *   [e.g., Achieved all stated objectives.]
    *   [e.g., Good progress made, but some topics need more time.]
    *   [e.g., Ran over time, could have been more focused.]

---

**7. Next Steps & Follow-up:**
*   [e.g., Next scheduled meeting: YYYY-MM-DD to discuss Z.]
*   [e.g., Our team to circulate these notes and the updated action item list by EOD tomorrow.]
*   [e.g., Client to review and provide feedback on [Document Name] by [Date].]

---


## MEETING CONTEXT/NOTES START ####################################################################################################################################

<PROJECT_COMPANY_CONTEXT>

## SLIDE NOTES ####################################################################################################################################################

<SLIDE_NOTES>

## MEETING TRANSCRIPT #############################################################################################################################################

<MEETING_TRANSCRIPT>`;
