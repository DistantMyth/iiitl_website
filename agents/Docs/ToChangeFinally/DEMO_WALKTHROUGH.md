# Demonstration walkthrough

Start with `npm run dev`, then open the printed local address. Choose Reset demo data from any portal before presenting if prior edits exist.

## Website

1. Scroll the homepage: the IIIT Lucknow lettering sits between the sky and the building silhouette. Continue through programs, the animated research motif, campus photographs, and source notices.
2. Switch program tabs; open a program and its admission resources.
3. Use Find your way (or Ctrl/Cmd K) to locate Course explorer. Filter by subject and inspect a syllabus. Print or save the sample curriculum as PDF.
4. Explore the calendar; export a month as an `.ics` file.
5. Search the faculty directory and open an internal profile.
6. Open a campus gallery photo in the lightbox.
7. Filter tenders by status or corrigenda; open a detail and download a sample notice.
8. Try the global search (⌘K), accessibility settings, Hindi branding, and mobile navigation.

## Faculty → Exam Cell → Student

1. Portal login → Login as Faculty → Marks & grading.
2. Download the `.xlsx` template. It contains three sample students. Edit permitted scores and import it, or change scores directly in the table.
3. Invalid bounds, changed roll numbers, or a missing roster row are rejected. Submit the valid draft.
4. Switch role to Exam Cell → Result moderation. To demonstrate revisions, enter a note and return for correction; then resubmit from Faculty.
5. Approve the submission, then publish. The toast makes clear that no email was sent.
6. Switch to Student → My results. Inspect the grade card, weighted SGPA, and illustrative CGPA. Print/save the demo grade card.

## Student → Department approvals → Accounts

1. Student → No-dues clearance. Select a reason, enter a fake bank reference, and initiate.
2. Switch to Super Admin → Clearance approvals. Approve the first six stages in order. Each subsequent approval stays disabled until prior stages are approved.
3. Final Accounts approval remains disabled while hostel/mess balances remain unpaid.
4. Accounts → Student ledgers. Mark hostel rent and mess advance paid using demo UTR references, or export/edit/import the reconciliation workbook.
5. Accounts → Clearance approvals → approve final stage.
6. Student → No-dues clearance. Inspect the refund preview and print the explicitly marked demo certificate. No refund or official document has been issued.

Faculty can demonstrate the lab approval stage; Accounts handles the final stage. Super Admin covers the other departments in this prototype.

## Administration

- Institute Admin → Website content: change the headline, save, return to Home. Publish a notice and find it on News.
- Institute Admin → Media & brochures: add an image under 700 KB with alt text; open the public gallery. Choose a brochure PDF to demonstrate selection (only its filename persists).
- Registrar → Tender management: create a record; edit status and corrigendum; inspect it on the public tender page.
- Super Admin → People & access: add a sample user, change a role, suspend/reactivate.
- Super Admin → Roles & permissions: toggle the illustrative permission selection; it does not alter actual workspace access.
- Super Admin → Audit activity: see local workflow changes. Production audit logs must be immutable and server-side.

## Local-state behavior

All roles share data within the same browser storage. Browser refresh preserves changes. Different browsers/devices do not share records. Reset restores the seed state. Do not use real student, bank, or confidential grievance data in a demonstration.
