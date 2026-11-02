# קהילאה — ספר בעלי ובעלות מקצוע

דף קהילה בעברית ובתצוגת RTL, על בסיס NestJS. הדף טוען את אנשי המקצוע מתוך `data/professionals.csv` ומאפשר לחפש לפי תחום העיסוק.

## הפעלה

נדרשת התקנה של Node.js 20 ומעלה.

```bash
npm install
npm run start:dev
```

פותחים את `http://localhost:3000`. לבניית גרסת הפקה: `npm run build` ואז `npm start`.

## הפעלה ב־Dev Container

נדרשים Docker ו־Visual Studio Code עם ההרחבה Dev Containers. פותחים את תיקיית הפרויקט ב־VS Code, בוחרים **Reopen in Container**, וממתינים להתקנת החבילות. לאחר מכן מריצים בטרמינל של VS Code:

```bash
npm run start:dev
```

פורט 3000 יועבר אוטומטית למחשב המקומי; פותחים את `http://localhost:3000`.

## מיפוי הנתונים

השרת משתמש בעמודות B–E ו־G–K בקובץ המקור; עמודה F ושאר העמודות אינן נקראות. שורות ללא תחום עיסוק בעמודה G אינן מוצגות. הקובץ `public/kehilea.jpeg` משמש כתמונת הנושא של האתר.
