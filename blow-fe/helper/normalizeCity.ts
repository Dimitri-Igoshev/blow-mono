// Normalize & transliterate Russian city names from latin -> Cyrillic with special cases
export function normalizeCity(raw: string): string {
	const input = (raw || "").trim();

	if (!input) return "";

	// ---- helpers
	const normalizeKey = (s: string) =>
		s
			.toLowerCase()
			.normalize("NFKD")
			.replace(/[^\p{L}\p{N}]+/gu, " ") // keep spaces for multi-word keys
			.replace(/\s+/g, " ")
			.trim();

	const compactKey = (s: string) => normalizeKey(s).replace(/\s+/g, ""); // alias key without spaces (saintpetersburg)

	const titleCase = (s: string) =>
		s
			.split(/(\s|-)/)
			.map((part) => {
				if (part === " " || part === "-") return part;
				return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
			})
			.join("");

	// ---- exact dictionary for common cities (english -> russian)
	// keys are normalized (lower, single space), values are final proper-case Russian
	const dict: Record<string, string> = {
		moscow: "Москва",
		moskva: "Москва",
		msk: "Москва",

		"saint petersburg": "Санкт-Петербург",
		"st petersburg": "Санкт-Петербург",
		"saint-petersburg": "Санкт-Петербург",
		spb: "Санкт-Петербург",
		piter: "Санкт-Петербург",
		"st-pete": "Санкт-Петербург",

		"nizhny novgorod": "Нижний Новгород",
		novosibirsk: "Новосибирск",
		yekaterinburg: "Екатеринбург",
		ekaterinburg: "Екатеринбург",
		kazan: "Казань",
		chelyabinsk: "Челябинск",
		omsk: "Омск",
		samara: "Самара",
		"rostov on don": "Ростов-на-Дону",
		ufa: "Уфа",
		krasnoyarsk: "Красноярск",
		perm: "Пермь",
		voronezh: "Воронеж",
		volgograd: "Волгоград",
		saratov: "Саратов",
		tyumen: "Тюмень",
		tolyatti: "Тольятти",
		izhevsk: "Ижевск",
		barnaul: "Барнаул",
		ulyanovsk: "Ульяновск",
		irkutsk: "Иркутск",
		khabarovsk: "Хабаровск",
		yaroslavl: "Ярославль",
		vladivostok: "Владивосток",
		sochi: "Сочи",
		kaliningrad: "Калининград",
		astrakhan: "Астрахань",
		lipetsk: "Липецк",
		kirov: "Киров",
		cheboksary: "Чебоксары",
		tula: "Тула",
		ryazan: "Рязань",
		penza: "Пенза",
		kursk: "Курск",
		stavropol: "Ставрополь",
	};

	// also allow compact aliases without spaces (e.g., saintpetersburg)
	const aliasCompact: Record<string, string> = {
		saintpetersburg: "Санкт-Петербург",
		stpetersburg: "Санкт-Петербург",
		rostovondon: "Ростов-на-Дону",
	};

	const key = normalizeKey(input);
	const compact = compactKey(input);

	if (dict[key]) return dict[key];
	if (aliasCompact[compact]) return aliasCompact[compact];

	// If already Cyrillic, just tidy casing
	if (/[А-Яа-яЁё]/.test(input)) {
		return titleCase(input);
	}

	// ---- transliteration fallback (latin -> russian)
	const latin = key;

	// Order matters: handle longest multi-graphs first
	const multigraphs: Array<[RegExp, string]> = [
		[/shch/g, "щ"],
		[/sch/g, "щ"],
		[/yo/g, "ё"],
		[/zh/g, "ж"],
		[/kh/g, "х"],
		[/ts/g, "ц"],
		[/ch/g, "ч"],
		[/sh/g, "ш"],
		[/yu/g, "ю"],
		[/ya/g, "я"],
	];

	// Do replacements word by word to apply some word-end rules
	const words = latin.split(" ");

	const transliterated = words
		.map((w) => {
			let s = w;

			// multigraphs
			for (const [re, ru] of multigraphs) s = s.replace(re, ru);

			// special beginnings
			s = s.replace(/^ye/, "е"); // Yekaterinburg -> Екатеринбург
			s = s.replace(/^yo/, "ё"); // Yolki -> Ёлки
			s = s.replace(/^yu/, "ю");
			s = s.replace(/^ya/, "я");

			// word-end patterns
			s = s.replace(/iy$/, "ий");
			s = s.replace(/yy$/, "ый");

			// single letters
			const single: Record<string, string> = {
				a: "а",
				b: "б",
				v: "в",
				g: "г",
				d: "д",
				e: "е",
				z: "з",
				i: "и",
				j: "й",
				k: "к",
				l: "л",
				m: "м",
				n: "н",
				o: "о",
				p: "п",
				r: "р",
				s: "с",
				t: "т",
				u: "у",
				f: "ф",
				h: "х",
				c: "к",
				q: "к",
				w: "в",
				x: "кс",
				y: "ы", // crude default
				// keep apostrophes/accents out; hyphen handled later
			};
			s = s.replace(/[a-z]/g, (ch) => single[ch] ?? ch);

			// tidy hyphen cases like "na-donu" later
			return s;
		})
		.join(" ");

	// small post-fixes
	let ru = transliterated
		.replace(/\b-na-donu\b/gi, "-на-Дону") // hard hyphen
		.replace(/\s*-\s*/g, "-"); // keep user hyphens tight

	// title-case words and keep hyphens
	ru = titleCase(ru);

	return ru;
}
