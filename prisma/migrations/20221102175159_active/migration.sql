-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Product" ("id", "name") SELECT "id", "name" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_Tracker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "querySelector" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Tracker_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tracker" ("id", "productId", "querySelector", "url") SELECT "id", "productId", "querySelector", "url" FROM "Tracker";
DROP TABLE "Tracker";
ALTER TABLE "new_Tracker" RENAME TO "Tracker";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
