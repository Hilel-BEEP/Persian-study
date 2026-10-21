import { Scenario, PronunciationExercise, ColloquialRule, SlangPhrase, QuizQuestion } from '../types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'free',
    titleHe: 'שיחה חופשית והיכרות',
    titleFa: 'گفتگوی آزاد و احوال‌پرسی',
    description: 'שיחה זורמת בכל נושא שתרצה, כולל שאלות על היום-יום, עבודה, משפחה ומזג אוויר',
    iconName: 'MessageSquare',
    promptContext: 'תרחיש שיחה חופשית ידידותית. שאל את המשתמש מה שלומו, איך עבר עליו היום, וענה בחום עם ביטויי חיבה טהראניים.',
    starterMessage: {
      farsi: 'سلام دوست من! چطوری؟ خوبی؟ همه چی روبه‌راهه؟',
      fingilish: 'Salam dooste man! Chetori? Khoobi? Hame chi roo-be-rahe?',
      hebrew: 'שלום חבר שלי! מה נשמע? הכל טוב? הכל בסדר?'
    }
  },
  {
    id: 'bazaar',
    titleHe: 'שוק הבזאר הגדול בטהראן (מיקוח וקניות)',
    titleFa: 'بازار بزرگ تجریش و چانه‌زنی',
    description: 'תרגול קניות, שאלת מחירים, מיקוח פרסי אמיתי ("چند میدی؟ تخفیف بده")',
    iconName: 'ShoppingBag',
    promptContext: 'אתה סוחר נחמד בבזאר בטהראן שמוכר אגוזים, זעפרן, או שטיחים. פנה ללקוח בחום, נקוב במחיר בטומאן, והתמקח איתו בסבלנות.',
    starterMessage: {
      farsi: 'سلام قربان! بفرمایید تو، چایی میل دارید؟ پیسته‌ تازه داریم، قابلی هم نداره!',
      fingilish: 'Salam ghorban! Befarmaeed too, chaei meyl darid? Peste-ye taze darim, ghabelee ham nadareh!',
      hebrew: 'שלום אדוני! בבקשה תיכנס, רוצה תה? יש לנו פיסטוק טרי, וזה לא עולה כלום (טערוף: קח בחינם)!'
    }
  },
  {
    id: 'taarof',
    titleHe: 'אמנות הטַעֲרוֹף (تعارف) ואירוח',
    titleFa: 'رسم تعارف و مهمان‌نوازی ایرانی',
    description: 'לימוד ותרגול הקודים החברתיים החשובים ביותר בתרבות האיראנית: מחמאות, סירוב מנומס והכרת תודה',
    iconName: 'HeartHandshake',
    promptContext: 'תרגול טערוף: אתה מארח בבית פרסי מסורתי, מגיש כיבוד, והמשתמש צריך לדעת איך לסרב תחילה בנימוס ולקבל בהערכה.',
    starterMessage: {
      farsi: 'خیلی خوش اومدین! قدمتون روی چشم! توروخدا بفرمایید بالا بشینید، خونه‌ خودتونه.',
      fingilish: 'Kheyli khosh oomadin! Ghadametoon rooye cheshm! Toro khoda befarmaeed bala beshinid, khooneh-ye khodetone.',
      hebrew: 'ברוכים הבאים כל כך! בואכם על עיניי (כבוד גדול)! בחיי אלוהים שבו למעלה, זה הבית שלכם.'
    }
  },
  {
    id: 'restaurant',
    titleHe: 'מסעדה איראנית (הזמנת צ׳לו קבאב ודוּע׳)',
    titleFa: 'رستوران سنتی و سفارش چلوکباب',
    description: 'הזמנת קבאב קובידה, אורז עם זעפרן, שתיית דוע׳ (משקה יוגורט ונענע) וקינוח באסטני זעפרני',
    iconName: 'Utensils',
    promptContext: 'אתה מלצר במסעדת קבאב מסורתית בטהראן. הגש את התפריט, המלץ על צ׳לו קבאב קובידה עם חמאה וסומאק.',
    starterMessage: {
      farsi: 'سلام، خوش اومدید! امروز کباب کوبیده مخصوص با دوغ آبعلی و ته‌دیگ زعفرونی داریم. چی میل دارید بیارم براتون؟',
      fingilish: 'Salam, khosh oomadid! Emrooz kabab koobideh makhsoos ba doogh-e Ab-Ali va tah-deeg-e za\'farooni darim. Chi meyl darid biaram baratun?',
      hebrew: 'שלום וברוכים הבאים! היום יש לנו קבאב קובידה מיוחד עם משקה דוע׳ אב-עלי ותחתיג (אורז פריך) זעפרני. מה תרצו שאביא לכם?'
    }
  },
  {
    id: 'taxi',
    titleHe: 'נסיעה במונית סנאפ (Snapp) וניווט',
    titleFa: 'تاکسی اینترنتی اسنپ و آدرس پرسیدن',
    description: 'שיחת נהג מונית טהראני טיפוסית: תנועה ברחובות, פניות ("بپیچ به راست"), ותשלום בכרטיס אשראי/מזומן',
    iconName: 'Car',
    promptContext: 'אתה נהג סנאפ (אובר איראני) בטהראן. אספת את הנוסע, שאל לאן הוא נוסע, פטפט על הפקקים בווליעסר והצע להפעיל מזגן.',
    starterMessage: {
      farsi: 'سلام داداش! مقصدتون خیابون ولیعصره درسته؟ ترافیک سنگینه، کولر روشن کنم یا شیشه رو بکشم پایین؟',
      fingilish: 'Salam dadash! Maghsadetoon khiaboon-e Vali-e Asr-e doroste? Terafik sangeeneh, kooler roshan konam ya sheesheh ro bekesham paeen?',
      hebrew: 'שלום אחי! היעד שלך זה רחוב וליעסר נכון? יש פקק כבד, להדליק מזגן או להוריד חלון?'
    }
  }
];

export const PRONUNCIATION_EXERCISES: PronunciationExercise[] = [
  {
    id: 'ex-1',
    category: 'ברכות ויומיום',
    farsi: 'سلام، قربونت برم! چطوری؟',
    fingilish: 'Salam, ghorboonet beram! Chetori?',
    hebrew: 'שלום, אקריב את עצמי למענך (כפרה עליך)! מה שלומך?',
    colloquialTip: 'האות ק (قاف) נהגית עמוק מהלוע, כמו ע׳/ג׳ גרונית. הביטוי "قربونت برم" הוא אולי הנפוץ ביותר בטהראן!',
    difficulty: 'קל'
  },
  {
    id: 'ex-2',
    category: 'תודה ונימוס (טערוף)',
    farsi: 'دستت درد نکنه، خیلی زحمت کشیدی!',
    fingilish: 'Dastet dard nakone, kheyli zahmat keshidi!',
    hebrew: 'שידך לא תכאב (תודה רבה מכל הלב), טרחת כל כך הרבה!',
    colloquialTip: 'זהו הביטוי השכיח ביותר לומר תודה על עזרה, הגשת אוכל או מתנה.',
    difficulty: 'קל'
  },
  {
    id: 'ex-3',
    category: 'פעלים וצמצום טהראני',
    farsi: 'دارم می‌رم خونه نون بخرم.',
    fingilish: 'Daram mi-ram khooneh noon bekharam.',
    hebrew: 'אני הולך הביתה לקנות לחם.',
    colloquialTip: 'שים לב: במקום "می‌روم خانه نان" הספרותי, המדוברת הופכת ל-"می‌رم خونه نون". התנועה an הפכה ל-oon!',
    difficulty: 'בינוני'
  },
  {
    id: 'ex-4',
    category: 'סלנג עמוק',
    farsi: 'خیلی مخلصیم، هواتو دارم داداش!',
    fingilish: 'Kheyli makhlesim, havato daram dadash!',
    hebrew: 'נאמנים לך מאוד (לשירותך), אני שומר עליך אחי!',
    colloquialTip: '"هواتو دارم" פירושו המילולי "יש לי את האוויר שלך" ומשמעותו "אני דואג לך/שומר עליך".',
    difficulty: 'בינוני'
  },
  {
    id: 'ex-5',
    category: 'שיחה מתקדמת',
    farsi: 'قابلی نداره، چشمتون روشن، خوش اومدین!',
    fingilish: 'Ghabelee nadareh, cheshmetoon roshan, khosh oomadin!',
    hebrew: 'אין לזה ערך (בחינם בשבילך), עיניכם מוארות, ברוכים הבאים!',
    colloquialTip: 'צירוף טערוף מושלם שמשלב הכנסת אורחים עתיקה עם הגייה מודרנית וזורמת.',
    difficulty: 'אתגרי'
  }
];

export const COLLOQUIAL_RULES: ColloquialRule[] = [
  {
    id: 'rule-an-oon',
    titleHe: 'מעבר התנועות הגדול: [ān / ām] הופך ל-[ūn / ūm]',
    titleFa: 'تبدیل «آن» و «ام» به «اون» و «اوم»',
    descriptionHe: 'זהו הכלל המאפיין ביותר את הדיאלקט הטהראני המדובר. כמעט כל צירוף של [an] בספרותית הופך ל-[oon] במדוברת!',
    formalExample: {
      farsi: 'نان، خانه، تهران، باران، کجاست؟',
      fingilish: 'Nan, Khaneh, Tehran, Baran, Kojast?',
      hebrew: 'לחם, בית, טהראן, גשם, איפה זה?'
    },
    colloquialExample: {
      farsi: 'نون، خونه، تهرون، بارون، کجاست؟',
      fingilish: 'Noon, Khooneh, Tehroon, Baroon, Kojast?',
      hebrew: 'נוּן (לחם), חוּנֶה (בית), תֶהרוּן (טהראן), בָּארוּן (גשם)'
    },
    ruleExplanation: 'הגיית [an] נתפסת כיום באיראן כשפה ספרותית יבשה של חדשות או ספרים. שיחה יומיומית תמיד תשתמש ב-[oon].',
    culturalInsight: 'יוצאים מן הכלל: שמות קדושים (قرآن - קוראן נשאר קור-אן) או מילים זרות חדשות.'
  },
  {
    id: 'rule-verbs',
    titleHe: 'צמצום סיומות פעלים (Contractions)',
    titleFa: 'کوتاه‌سازی افعال و صرف محاوره‌ای',
    descriptionHe: 'בפרסית המדוברת מקצרים את בסיס ההווה והסיומות כדי לדבר בקצב מהיר וזורם.',
    formalExample: {
      farsi: 'می‌خواهم بروم، نمی‌دانم چه می‌گوید.',
      fingilish: 'Mi-khaham beravam, nemi-danam che mi-gooyad.',
      hebrew: 'אני רוצה ללכת, אינני יודע מה הוא אומר (ספרותי).'
    },
    colloquialExample: {
      farsi: 'می‌خوام برم، نمی‌دونم چی می‌گه.',
      fingilish: 'Mi-kham beram, nemi-doonam chi mi-geh.',
      hebrew: 'מי-ח׳אם בֶּרָם, נֶמי-דוּנָם צ׳י מִי-גֶה (מדובר טהראני).'
    },
    ruleExplanation: 'סיומת גוף ראשון -am נשמרת אך השורש מתקצר (خواهم -> خام, روم -> رم, دانم -> دونم). גוף שלישי יחיד משמיט את ה-ad והופך ל-e (می‌رود -> می‌ره, می‌گوید -> می‌گه).',
    culturalInsight: 'אם תדבר בטהראן עם פעלים מלאים כמו "می‌خواهم", יחשבו שאתה מצטט שיר של חאפז או קורא הצהרה רשמית!'
  },
  {
    id: 'rule-pronouns',
    titleHe: 'גופים, כינויים וסיומת המושא (-ro / -o)',
    titleFa: 'ضمیرها و نشانه مفعولی «رو»',
    descriptionHe: 'סיומת מושא ישיר "را" (ra) הופכת ל-"رو" (ro) אחרי תנועה או פשוט ל-"-o" אחרי עיצור.',
    formalExample: {
      farsi: 'آن‌ها کتاب را به من دادند.',
      fingilish: 'Anha ketab ra be man dadand.',
      hebrew: 'הם נתנו את הספר לי (ספרותי).'
    },
    colloquialExample: {
      farsi: 'اونا کتابو دادن به من.',
      fingilish: 'Oona ketabo dadan be man.',
      hebrew: 'אוּנָא כֶּתָאבּוֹ דָאדַן בֶּה מַן (טהראני).'
    },
    ruleExplanation: 'آن‌ها (הם) הופך ל-اونا (oona). این‌ها (אלה) הופך ל-اینا (eena). كتاب را הופך ל-کتابو (ketabo).',
    culturalInsight: 'הכינוי "شما" (אתה/אתם מנומס) הופך ל-"שומא" אך הכינוי המחובר הוא -toon במקום -etan.'
  },
  {
    id: 'rule-ast-e',
    titleHe: 'פועל העזר "הינו / זה" (است -> ه / ـه)',
    titleFa: 'ساده‌سازی فعل «است» به «ـه»',
    descriptionHe: 'המילה "است" (ast = הינו/זה) מתקצרת כמעט תמיד לסיומת "-e" צמודה למילה.',
    formalExample: {
      farsi: 'این هوا امروز بسیار خوب است.',
      fingilish: 'In hava emrooz besyar khoob ast.',
      hebrew: 'מזג אוויר זה היום טוב מאוד הינו (ספרותי).'
    },
    colloquialExample: {
      farsi: 'این هوا امروز خیلی خوبه.',
      fingilish: 'In hava emrooz kheyli khoob-e.',
      hebrew: 'אין הַוָא אֶמרוּז חֶילִי חוּבֶּה (מדובר).'
    },
    ruleExplanation: 'במקום להגות "ast" בסוף המשפט, מחברים תנועת "e" רכה (חוּבּ -> חוּבֶּה, גָארְם -> גָארְמֶה).',
    culturalInsight: 'זהו אחד הסימנים המובהקים ביותר שמאפשרים להבדיל בין עולה חדש לשפה לבין דובר שרכש פרסית מדוברת טבעית.'
  }
];

export const SLANG_PHRASES: SlangPhrase[] = [
  {
    id: 'slang-1',
    phraseFa: 'قربونت برم',
    phraseFingilish: 'Ghorboonet beram',
    literalTranslationHe: 'שאני אקריב את עצמי למענך',
    actualMeaningHe: 'כפרה עליך / תודה מקרב לב / יקירי',
    category: 'הבעת חיבה',
    contextExample: 'משמש בכל סיום שיחה, הודיה על כוס קפה או מחמאה.'
  },
  {
    id: 'slang-2',
    phraseFa: 'چاکرم / نوکرم',
    phraseFingilish: 'Chakeram / Nokaram',
    literalTranslationHe: 'אני המשרת / העבד שלך',
    actualMeaningHe: 'לשירותך תמיד / בכיף גבר / אין בעד מה',
    category: 'סלנג חברים',
    contextExample: 'סלנג גברי נפוץ מאוד בין חברים ("چاکرم داداش").'
  },
  {
    id: 'slang-3',
    phraseFa: 'خسته نباشی',
    phraseFingilish: 'Khaste nabashi',
    literalTranslationHe: 'שלא תהיה עייף',
    actualMeaningHe: 'יישר כוח / כל הכבוד על העבודה / שלום לפועל או מוכר',
    category: 'יומיומי',
    contextExample: 'נאמר לכל מי שעובד: נהג מונית בסוף נסיעה, קופאי, תלמיד שחזר מבית ספר.'
  },
  {
    id: 'slang-4',
    phraseFa: 'دستت درد نکنه',
    phraseFingilish: 'Dastet dard nakone',
    literalTranslationHe: 'שידך לא תכאב',
    actualMeaningHe: 'תודה רבה! (התשובה המנומסת: سلامت باشی - תהיה בריא)',
    category: 'טערוף (تعارف)',
    contextExample: 'נאמר לאמא שבישלה ארוחה, למארח או למישהו שעזר לך לסחוב שקית.'
  },
  {
    id: 'slang-5',
    phraseFa: 'جیگرتو بخورم',
    phraseFingilish: 'Jeegareto bekhoram',
    literalTranslationHe: 'שאני אוכל את הכבד שלך',
    actualMeaningHe: 'אני חולה עליך / כמה שאתה מתוק!',
    category: 'הבעת חיבה',
    contextExample: 'נאמר לילדים קטנים, לאהובים או לחברים הכי טובים בחיבה עזה.'
  },
  {
    id: 'slang-6',
    phraseFa: 'قابلی نداره',
    phraseFingilish: 'Ghabelee nadareh',
    literalTranslationHe: 'זה חסר ערך (לא ראוי לך)',
    actualMeaningHe: 'קח את זה בחינם (טערוף בחנות - כמובן שצריך להתעקש ולשלם!)',
    category: 'טערוף (تعارف)',
    contextExample: 'כשאתה שואל מוכר בבזאר כמה זה עולה, הוא כמעט תמיד יגיד קודם "قابلی نداره".'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    questionHe: 'איך אומרים "אני רוצה ללכת הביתה" בפרסית מדוברת טהראנית (עממית)?',
    options: [
      {
        textFa: 'می‌خوام برم خونه',
        textFingilish: 'Mi-kham beram khooneh',
        textHe: 'מי-ח׳אם בֶּרָם חוּנֶה (מדוברת טהראנית)',
        isCorrect: true
      },
      {
        textFa: 'می‌خواهم بروم به خانه',
        textFingilish: 'Mi-khaham beravam be khaneh',
        textHe: 'מי-ח׳אהאם בֶּרַוַאם בֶּה ח׳אנֶה (ספרותית ארכאית)',
        isCorrect: false
      },
      {
        textFa: 'من رفتم خانه',
        textFingilish: 'Man raftam khaneh',
        textHe: 'הלכתי לבית (זמן עבר)',
        isCorrect: false
      }
    ],
    explanationHe: 'בפרסית מדוברת טהראנית, הפועל می‌خواهم מתקצר ל-می‌خوام, הפועל بروم ל-برم, והמילה خانه עוברת שינוי תנועה ל-خونه (an -> oon).'
  },
  {
    id: 'q2',
    questionHe: 'מה המשמעות האמיתית של ביטוי החיבה "قربونت برم" (Ghorboonet beram)?',
    options: [
      {
        textFa: 'خیلی دوستت دارم / فدات بشم',
        textFingilish: 'Kheyli dooset daram / Fadat besham',
        textHe: 'כפרה עליך / אני אוהב אותך מאוד / יקירי',
        isCorrect: true
      },
      {
        textFa: 'می‌خواهم به مکه بروم',
        textFingilish: 'Mi-khaham be Makkeh beravam',
        textHe: 'אני רוצה לנסוע לחג הקורבן',
        isCorrect: false
      },
      {
        textFa: 'عصبانی هستم',
        textFingilish: 'Asabani hastam',
        textHe: 'אני כועס עליך',
        isCorrect: false
      }
    ],
    explanationHe: 'הביטוי פירושו המילולי "אקריב את עצמי למענך" (כמו "כפרה עליך" בסלנג הישראלי), ומשמש לחיבה עמוקה והכרת תודה חמה.'
  },
  {
    id: 'q3',
    questionHe: 'מה נכון לעשות כאשר בעל חנות פרסי אומר לך "قابلی نداره" (זה לא ראוי לך/קח בחינם)?',
    options: [
      {
        textFa: 'اصرار به پرداخت پول (تعارف را رد کردن)',
        textFingilish: 'Esrar be pardakht-e pool (Taarof)',
        textHe: 'להתעקש מתוך כבוד לשלם לו את מלוא המחיר! זהו טַעֲרוֹף מסורתי.',
        isCorrect: true
      },
      {
        textFa: 'کالا را بردارید و تشکر کنید و بروید',
        textFingilish: 'Kala ra bardarid va tashakor konid',
        textHe: 'לקחת את המוצר בחינם, להגיד תודה וללכת',
        isCorrect: false
      },
      {
        textFa: 'از کالا ایراد بگیرید چون بی‌ارزش است',
        textFingilish: 'Az kala irad begirid',
        textHe: 'להעליב את הסחורה כי הוא אמר שאין לה ערך',
        isCorrect: false
      }
    ],
    explanationHe: 'טַעֲרוֹף (تعارف) הוא קוד נימוס איראני עמוק. המוכר מציע את המוצר חינם כהבעת כבוד, והקונה המנומס תמיד מסרב ומתעקש לשלם ("خواهش می‌کنم، این چه حرفیه!").'
  },
  {
    id: 'q4',
    questionHe: 'מהי הצורה המדוברת של כינוי הגוף "آن‌ها" (הם)?',
    options: [
      {
        textFa: 'اونا (Oona)',
        textFingilish: 'Oona',
        textHe: 'אוּנָא (Oona)',
        isCorrect: true
      },
      {
        textFa: 'ایشان (Ishan)',
        textFingilish: 'Ishan',
        textHe: 'אישאן (Ishan - צורה ספרותית מכבדת)',
        isCorrect: false
      },
      {
        textFa: 'ماها (Maha)',
        textFingilish: 'Maha',
        textHe: 'מאהא (אנחנו)',
        isCorrect: false
      }
    ],
    explanationHe: 'הכינוי آن‌ها מקבל את חוק ה-an -> oon והופך ל-اونا (Oona). באותו אופן این‌ها (אלה) הופך ל-اینا (Eena).'
  }
];
