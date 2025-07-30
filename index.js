//To see how the final website should work, run "node solution.js".
//Make sure you have installed all the dependencies with "npm i".
//The password is ILoveProgramming
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import bodyParser from "body-parser";

const app = express();
const port = 3000;
//var userIsAuthorised = false;

app.use(bodyParser.urlencoded({extended:true}));

// function passwordCheck(req, res, next) {
//   const password = req.body["password"];
//   if (password === "ILoveProgramming") {
//     userIsAuthorised = true;
//   }
//   next();
// }
// app.use(passwordCheck);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/check", (req, res) => {
   console.log(req.body);
     if(req.body.password === "ILoveProgramming"){
       res.sendFile(__dirname + "/public/secret.html");
     }else{
       res.sendFile(__dirname + "/public/index.html");
     } 
//   if (userIsAuthorised) {
//     res.sendFile(__dirname + "/public/secret.html");
//   } else {
//     res.sendFile(__dirname + "/public/index.html");
//     //res.redirect("/");
//   }  
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// השיטה הזאת פחות טובה כי אם היו מספר נקודות קצה שדורשות אימות היינו צריכים לשכל את לוגיקת האימות לכל אחת מהן. 
// המעבר לשימוש ב-Middleware לאימות הוא צעד נכון וחשוב. הוא מפריד את דאגת האימות מהלוגיקה העסקית של ה-Route Handler, וזוהי פרקטיקה טובה מאוד. עם זאת, שימוש במשתנה גלובלי לאחסון מצב האימות הוא מסוכן מאוד ביישום שרת. הדרך הנכונה היא להוסיף את המידע לאובייקט הבקשה (req), כך שכל בקשה תקבל את הסטטוס אימות משלה.
// בעיה מהותית בשימוש במשתנה גלובלי כמו userIsAuthorised בדרך זו.
// הבעיה עם var userIsAuthorised = false; כפי שהיא מיושמת כאן:
// מצב גלובלי משותף (Shared Global State): userIsAuthorised הוא משתנה גלובלי יחיד לכל השרת.
// אם יש מצב שבו שני משתמשים ניגשים לשרת בו-זמנית:
// משתמש א' מזין סיסמה נכונה. passwordCheck מופעל, ו-userIsAuthorised הופך ל-true.
// באותו רגע, משתמש ב' (שאולי לא מורשה) שולח בקשה. ה-app.post("/check", ...) של משתמש ב' יראה ש-userIsAuthorised הוא true (כי משתמש א' בדיוק אימת את עצמו), ועלול להעניק בטעות גישה למשתמש ב'!
// זהו סיכון אבטחתי חמור ובעיה חמורה של "מצב מרוצי" (race condition) בשרתים.
// הדרך הטובה יותר:
// הדרך המקובלת והבטוחה להעביר מידע מ-Middleware ל-Route Handler, או לנהל מצב אימות עבור בקשה ספציפית, היא להוסיף מאפיין לאובייקט ה-req (בקשה) עצמו. אובייקט req הוא ייחודי לכל בקשה נכנסת, ולכן לא תהיה בעיית מצב גלובלי משותף

// import express from "express";
// import { dirname } from "path";
// import { fileURLToPath } from "url";
// const __dirname = dirname(fileURLToPath(import.meta.url));
// import bodyParser from "body-parser";

// const app = express();
// const port = 3000;

// app.use(bodyParser.urlencoded({ extended: true }));

// // Middleware לאימות - מעדכן את אובייקט הבקשה
// function passwordCheck(req, res, next) {
//   const password = req.body["password"]; // נגיש לסיסמה מהטופס
//   if (password === "ILoveProgramming") {
//     req.isAuthenticated = true; // מוסיף מאפיין חדש לאובייקט ה-req
//   } else {
//     req.isAuthenticated = false; // מוודא שיהיה ערך גם במקרה של סיסמה שגויה
//   }
//   next(); // ממשיך הלאה
// }

// app.use(passwordCheck); // מיישם את ה-Middleware לכל הבקשות

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/public/index.html");
// });

// app.post("/check", (req, res) => {
//   if (req.isAuthenticated) { // בודק את המאפיין על אובייקט ה-req
//     res.sendFile(__dirname + "/public/secret.html");
//   } else {
//     // ניתן לשפר כאן ולשלוח הודעת שגיאה מפורטת יותר
//     res.send("<h1>Incorrect Password!</h1><p>Please try again.</p><a href='/'>Go back</a>");
//     // או להפנות בחזרה לדף ההתחברות
//     // res.sendFile(__dirname + "/public/index.html");
//   }
// });

// app.listen(port, () => {
//   console.log(`Listening on port ${port}`);
// });