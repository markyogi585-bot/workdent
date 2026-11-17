# WorkDent Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants
1. **PII Isolation (Split Collection)**: Private user PII (`email`, `phone`, `timezone`, `referralCode`) lives in `/users/{userId}/private/{docId}` and is readable/writable strictly by `request.auth.uid == userId`. Public profiles live in `/users/{userId}/public/{docId}`.
2. **Role Constraint (No Self-Escalation)**: Users may only set `role` to `'DENTIST'`, `'LAB'`, or `'DESIGNER'`, never `'ADMIN'`.
3. **Master Gate Relational Sync**: Subcollections `/projects/{projectId}/files/{fileId}` and `/projects/{projectId}/messages/{messageId}` require `get(/databases/$(database)/documents/projects/$(projectId))` to verify the requester is either the `dentistId` or `designerId` of the parent project.
4. **Terminal State Locking**: Once a project reaches terminal status (`COMPLETED`, `CANCELLED`), no further client updates are permitted.
5. **Temporal & Immortal Integrity**: `createdAt`, `dentistId`, `uid`, and `projectId` are immutable on update; `createdAt` and `updatedAt` must equal `request.time`.
6. **Query Enforcement**: Every `allow list` checks `resource.data` ownership (`resource.data.dentistId == request.auth.uid || resource.data.designerId == request.auth.uid` for projects, `resource.data.userId == request.auth.uid` for notifications).

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Payload 1 (Shadow Field Injection)**: `POST /projects/proj_1` with `{ ..., isVerifiedAdmin: true }` -> Rejected by `hasOnly`.
2. **Payload 2 (Unverified Email Write)**: Authenticated user with `email_verified: false` attempting project creation -> Rejected by `isVerifiedUser()`.
3. **Payload 3 (Cross-User PII Read)**: User `uid_B` reading `/users/uid_A/private/info` -> Rejected by `request.auth.uid == userId`.
4. **Payload 4 (Privilege Escalation Role)**: User creating `/users/uid_A/public/profile` with `role: "ADMIN"` -> Rejected by enum check `['DENTIST', 'LAB', 'DESIGNER']`.
5. **Payload 5 (ID Poisoning)**: Document ID containing spaces/slashes or >128 chars -> Rejected by `isValidId()`.
6. **Payload 6 (Value Poisoning on Update)**: Updating `Project.title` with a 5,000-character string or boolean -> Rejected by `isValidProject(incoming())` wrapping `allow update`.
7. **Payload 7 (Terminal State Mutation)**: Updating a project whose existing `status == 'COMPLETED'` -> Rejected by terminal state lock.
8. **Payload 8 (Orphaned Subcollection Write)**: Creating `/projects/nonexistent/messages/msg_1` -> Rejected by Master Gate `exists/get` check on parent project.
9. **Payload 9 (Unauthorized Subcollection Access)**: Unrelated user `uid_C` reading `/projects/proj_1/files/file_1` -> Rejected by Master Gate check on parent `dentistId`/`designerId`.
10. **Payload 10 (Timestamp Forgery)**: Creating a project with a past or future `createdAt` != `request.time` -> Rejected by `incoming().createdAt == request.time`.
11. **Payload 11 (Immortal Field Tampering)**: Updating `dentistId` or `createdAt` on an existing project -> Rejected by immutability gate.
12. **Payload 12 (Blanket List Scraping)**: Listing `/notifications` without filtering `userId == request.auth.uid` -> Rejected by `resource.data.userId == request.auth.uid`.
