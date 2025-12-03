-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Resume" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "templateType" TEXT NOT NULL DEFAULT 'classic',
    "colorTheme" TEXT NOT NULL DEFAULT 'blue',
    "fontFamily" TEXT NOT NULL DEFAULT 'sans',
    "fontSize" TEXT NOT NULL DEFAULT 'medium',
    "data" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Resume" ("colorTheme", "createdAt", "data", "fontFamily", "id", "templateType", "title", "updatedAt", "userId") SELECT "colorTheme", "createdAt", "data", "fontFamily", "id", "templateType", "title", "updatedAt", "userId" FROM "Resume";
DROP TABLE "Resume";
ALTER TABLE "new_Resume" RENAME TO "Resume";
CREATE INDEX "Resume_userId_idx" ON "Resume"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
