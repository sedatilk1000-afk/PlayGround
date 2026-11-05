// The docket. Each case is built so that the witness statement and the
// single exhibit either corroborate the charge or expose the truth.
// Sentence tiers follow the in-game guidelines:
//   fine   -> minor, non-violent, under $500, first offense
//   year1  -> significant theft/fraud, damage over $500, obstruction
//   year10 -> violence, arson endangering life, fraud over $50,000

export const SENTENCE_META = {
  fine: {
    label: 'Fine',
    short: 'Fine',
    detail: 'Minor, non-violent offenses. Property under $500. First offense.',
  },
  year1: {
    label: '1 Year',
    short: '1 Year',
    detail: 'Theft or fraud of significant value. Property damage over $500. Obstruction.',
  },
  year10: {
    label: '10 Years',
    short: '10 Years',
    detail: 'Violence. Arson endangering life. Fraud or counterfeiting over $50,000.',
  },
};

export const CASES = [
  {
    id: 1,
    docket: '114-B',
    title: 'The Stolen Bicycle',
    charge: 'Petty Theft',
    summary:
      'A hand-built bicycle vanished from outside the market. The next morning, the defendant was seen riding it toward a pawnshop two streets away.',
    claim: '“I bought it off a guy behind the market. I didn’t know it was stolen.”',
    defendant: {
      name: 'Tobias Hale',
      age: 19,
      occupation: 'Bicycle Apprentice',
      look: {
        skin: '#c98e63', shade: '#a46f4c',
        hair: '#5b3520', hairDark: '#3d2113',
        outfit: '#4e6440', outfitDark: '#35462c',
        shirt: '#e4d6b8', accent: '#b98b46',
        hairStyle: 'messy', accessory: 'none', build: 'slim',
      },
    },
    witness: {
      name: 'Abe Coleman',
      role: 'Bicycle Shop Owner',
      look: {
        skin: '#b97f5c', shade: '#946044',
        hair: '#9b958d', hairDark: '#6f6a64',
        outfit: '#5a4636', outfitDark: '#3f3025',
        shirt: '#cfc2a5', accent: '#6d7a58',
        hairStyle: 'cap', accessory: 'beard', build: 'broad',
      },
      statement:
        'I built that bike myself — the bell has a dented brass cap. Toby rolled it into my shop yesterday and asked what I’d pay for it. When I asked where he got it, he ran.',
    },
    evidence: {
      title: 'Pawnshop Bill of Sale',
      subtitle: 'Recovered from Bell & Sons Pawn',
      icon: 'receipt',
      exhibit: 'A',
      detail:
        'A signed bill of sale recovered from the pawnshop. The bicycle’s serial number matches the stolen bike, and the seller’s signature reads “T. Hale.” The bicycle itself was found in the shop’s back room.',
    },
    truth: 'guilty',
    sentence: 'fine',
    explanation:
      'The serial number, the signature, and Mr. Coleman’s identification place the stolen bicycle in Hale’s hands. The bike was recovered, no one was harmed, and this is a first offense — a fine is the just sentence.',
  },
  {
    id: 2,
    docket: '117-C',
    title: 'The Missing Charity Fund',
    charge: 'Embezzlement · $4,200',
    summary:
      'The winter relief fund is $4,200 short. The safe was untouched; only the ledger was altered, then partially burned in the office stove.',
    claim: '“I balanced that ledger myself. The missing money was a clerical error.”',
    defendant: {
      name: 'Margaret Vale',
      age: 47,
      occupation: 'Charity Treasurer',
      look: {
        skin: '#d6a377', shade: '#b07f58',
        hair: '#704230', hairDark: '#4b291d',
        outfit: '#3c4a63', outfitDark: '#283348',
        shirt: '#e7ddc9', accent: '#c8a55a',
        hairStyle: 'bun', accessory: 'glasses', build: 'regular',
      },
    },
    witness: {
      name: 'Priya Nand',
      role: 'Charity Assistant',
      look: {
        skin: '#a96f4c', shade: '#855437',
        hair: '#211713', hairDark: '#120c0a',
        outfit: '#6c4d5d', outfitDark: '#4c3441',
        shirt: '#d8c7ae', accent: '#b08a4f',
        hairStyle: 'bun', accessory: 'none', build: 'slim',
      },
      statement:
        'I came back for my umbrella and smelled smoke. Margaret was feeding pages into the stove. When I asked what she was doing, she told me to mind my own business.',
    },
    evidence: {
      title: 'Charred Ledger Page',
      subtitle: 'Recovered from the office stove',
      icon: 'ledger',
      exhibit: 'B',
      detail:
        'A half-burnt page recovered from the stove. It records four transfers totaling $4,200 to “Vale Consulting” — an account opened in the defendant’s name eleven days before the money went missing.',
    },
    truth: 'guilty',
    sentence: 'year1',
    explanation:
      'The transfers and the attempt to destroy the ledger are not clerical errors. She took $4,200 from a relief fund and tried to burn the proof. Under the guidelines, fraud of this size carries one year.',
  },
  {
    id: 3,
    docket: '121-A',
    title: 'The Bread on the Counter',
    charge: 'Theft · $200',
    summary:
      'A bakery’s register is $200 short after a confrontation with a customer. The baker swears the defendant grabbed a loaf and the cash before running.',
    claim: '“I paid for my bread. I put the coins on the counter and left. That’s all.”',
    defendant: {
      name: 'Samuel Reed',
      age: 38,
      occupation: 'Dockworker',
      look: {
        skin: '#7a4b32', shade: '#5d3724',
        hair: '#1b1210', hairDark: '#0e0908',
        outfit: '#4a4f41', outfitDark: '#33372d',
        shirt: '#b8ab8e', accent: '#8a5c36',
        hairStyle: 'beanie', accessory: 'beard', build: 'broad',
      },
    },
    witness: {
      name: 'Hattie Boone',
      role: 'Bakery Owner',
      look: {
        skin: '#c8946f', shade: '#a27050',
        hair: '#b9b3a8', hairDark: '#8a857c',
        outfit: '#7c5b45', outfitDark: '#59402f',
        shirt: '#e3d9c4', accent: '#9d4b42',
        hairStyle: 'bun', accessory: 'none', build: 'regular',
      },
      statement:
        'He had no money — I saw him dig through his pockets. Then he snatched a loaf and bolted. By the time I reached the register, the drawer was open and the cash was gone.',
    },
    evidence: {
      title: 'Enhanced Camera Still',
      subtitle: 'Bakery security · 6:12 p.m.',
      icon: 'photo',
      exhibit: 'C',
      detail:
        'A time-stamped still from the bakery’s camera. It shows the defendant placing bills and coins on the counter while the register drawer remains closed. The cash shortage is logged at 6:21 p.m., nine minutes after he left.',
    },
    truth: 'innocent',
    sentence: null,
    explanation:
      'The camera proves Reed paid and that the drawer was still shut when he left. The register was short nine minutes later, after other customers had approached the counter. The baker’s account is mistaken — not malicious. He is not guilty.',
  },
  {
    id: 4,
    docket: '126-D',
    title: 'The Chapel Wall',
    charge: 'Vandalism · $1,800',
    summary:
      'A historic chapel wall was sprayed with a lurid mural overnight. Restoration experts price the damage at $1,800 — far beyond a simple cleaning.',
    claim: '“I paint walls for a living, but I didn’t touch that chapel. Someone must have copied my tag.”',
    defendant: {
      name: 'Ines Marlow',
      age: 22,
      occupation: 'Muralist',
      look: {
        skin: '#b9845d', shade: '#966344',
        hair: '#2c2b33', hairDark: '#18171d',
        outfit: '#4b6470', outfitDark: '#33464f',
        shirt: '#d9c9a8', accent: '#a34b3f',
        hairStyle: 'long', accessory: 'none', build: 'slim',
      },
    },
    witness: {
      name: 'Father Michael Doyle',
      role: 'Chapel Caretaker',
      look: {
        skin: '#c9a082', shade: '#a17c60',
        hair: '#d5cfc2', hairDark: '#a49e92',
        outfit: '#26232a', outfitDark: '#19171c',
        shirt: '#d9d3c5', accent: '#b8a46c',
        hairStyle: 'bald', accessory: 'none', build: 'slim',
      },
      statement:
        'I found her at six in the morning with red paint on her hands and a can at her feet. The same mark is on the wall. She said it was “public art.”',
    },
    evidence: {
      title: 'Spray Can & Fresh Tag',
      subtitle: 'Recovered at the scene',
      icon: 'spray',
      exhibit: 'D',
      detail:
        'A red spray can recovered at the scene. The nozzle matches the paint on the wall, and the can bears the defendant’s studio inventory sticker. The tag matches eleven previous works signed by Marlow.',
    },
    truth: 'guilty',
    sentence: 'year1',
    explanation:
      'Her studio sticker, the matching nozzle, the signature tag, and her presence at dawn are not coincidence. The damage exceeds $500, and she showed no remorse. One year is the just sentence.',
  },
  {
    id: 5,
    docket: '130-F',
    title: 'The Warehouse Fire',
    charge: 'Arson · Endangerment',
    summary:
      'A riverside warehouse burns to its foundations at 2 a.m. Four residents in the flats above escape with their lives, but lose everything.',
    claim: '“I was doing my rounds on the east dock when I saw the smoke. I ran to call it in.”',
    defendant: {
      name: 'Viktor Soren',
      age: 34,
      occupation: 'Night Guard',
      look: {
        skin: '#c5a189', shade: '#a17f68',
        hair: '#6d6c66', hairDark: '#484743',
        outfit: '#33404f', outfitDark: '#222c37',
        shirt: '#9aa3a8', accent: '#b49a52',
        hairStyle: 'buzz', accessory: 'mustache', build: 'broad',
      },
    },
    witness: {
      name: 'Dora Finch',
      role: 'Neighbor · Third Floor',
      look: {
        skin: '#d3ab8d', shade: '#af876b',
        hair: '#a06a42', hairDark: '#74492c',
        outfit: '#6d5364', outfitDark: '#4d3947',
        shirt: '#d8ccb6', accent: '#a4824b',
        hairStyle: 'curly', accessory: 'glasses', build: 'regular',
      },
      statement:
        'I couldn’t sleep, so I was at my window. I saw Viktor pour something from a can along the loading door, then strike a light. He ran before the fire caught.',
    },
    evidence: {
      title: 'Fire Investigator’s Report',
      subtitle: 'Scene examination · 2:40 a.m.',
      icon: 'fire',
      exhibit: 'E',
      detail:
        'Two separate points of ignition at the loading door, accelerated by industrial solvent. The defendant’s melted security badge was found at the second point. He claims it was lost two days earlier.',
    },
    truth: 'guilty',
    sentence: 'year10',
    explanation:
      'Two ignition points destroy the accident theory. Ms. Finch saw him pour the accelerant, and his badge lay at the heart of the fire. Four people nearly died in their beds. Only ten years answers a crime that endangered so many lives.',
  },
  {
    id: 6,
    docket: '134-B',
    title: 'The Missing Necklace',
    charge: 'Grand Larceny · $12,000',
    summary:
      'A diamond necklace disappears from a hotel suite. The guest insists the maid was the only person who entered the room while she showered.',
    claim: '“I cleaned the room and left. I never opened the jewelry case. I would never steal from a guest.”',
    defendant: {
      name: 'Lila Moreau',
      age: 29,
      occupation: 'Hotel Housekeeper',
      look: {
        skin: '#8f5b3d', shade: '#6f442d',
        hair: '#231713', hairDark: '#120c0a',
        outfit: '#6c3d3f', outfitDark: '#4d2b2d',
        shirt: '#d5c9b2', accent: '#b8914e',
        hairStyle: 'bun', accessory: 'earrings', build: 'regular',
      },
    },
    witness: {
      name: 'Vivian Cross',
      role: 'Hotel Guest',
      look: {
        skin: '#d9b193', shade: '#b58d70',
        hair: '#c9a15e', hairDark: '#9c7944',
        outfit: '#463f4e', outfitDark: '#302b37',
        shirt: '#ded4c4', accent: '#b99c65',
        hairStyle: 'updo', accessory: 'earrings', build: 'slim',
      },
      statement:
        'I left the necklace on the vanity while I showered. When I came back, it was gone. Lila was the only one with a key. Who else could it be?',
    },
    evidence: {
      title: 'Claim Form & Keycard Log',
      subtitle: 'Hotel records · 9:40 p.m.',
      icon: 'key',
      exhibit: 'F',
      detail:
        'The necklace was insured three days before the alleged theft. The hotel’s keycard log shows Ms. Cross re-entered her own suite at 9:40 p.m., after the maid had finished and left.',
    },
    truth: 'innocent',
    sentence: null,
    explanation:
      'The guest entered the suite after the maid left, and she insured the necklace three days before claiming it was stolen. The evidence points not to theft, but to a false insurance claim. Ms. Moreau is not guilty.',
  },
  {
    id: 7,
    docket: '139-E',
    title: 'The Clinic Insulin',
    charge: 'Theft of Medicine',
    summary:
      'Two boxes of insulin are missing from a free clinic. A supply clerk says the defendant took them without signing the register.',
    claim: '“I took the insulin because a patient needed it. I knew the paperwork could be fixed later. I didn’t know anyone would call it theft.”',
    defendant: {
      name: 'Rosa Jimenez',
      age: 41,
      occupation: 'Clinic Nurse',
      look: {
        skin: '#b17c58', shade: '#8e6042',
        hair: '#33231c', hairDark: '#1e1410',
        outfit: '#3f6a64', outfitDark: '#2b4a45',
        shirt: '#d9d8cd', accent: '#b68f4e',
        hairStyle: 'ponytail', accessory: 'glasses', build: 'regular',
      },
    },
    witness: {
      name: 'Gerald Moss',
      role: 'Clinic Supply Clerk',
      look: {
        skin: '#cfa17e', shade: '#a97c5c',
        hair: '#8c8478', hairDark: '#625c53',
        outfit: '#55534a', outfitDark: '#3b3933',
        shirt: '#c9c0ab', accent: '#71603f',
        hairStyle: 'sidepart', accessory: 'mustache', build: 'slim',
      },
      statement:
        'She walked past the register with two boxes under her coat. We have a strict sign-out rule — no signature, no medicine. I reported it the same hour.',
    },
    evidence: {
      title: 'Emergency Authorization',
      subtitle: 'Signed by Dr. Amara Okafor',
      icon: 'vial',
      exhibit: 'G',
      detail:
        'A handwritten authorization signed by the clinic director at 7:15 p.m., the same hour as the shortage. It releases two boxes of insulin to the defendant for a patient in diabetic crisis. The patient’s chart confirms the dose was given.',
    },
    truth: 'innocent',
    sentence: null,
    explanation:
      'Rosa broke a paperwork rule, not the law. The clinic’s own director authorized the release, and the record shows a patient in crisis received the dose. She is not guilty.',
  },
  {
    id: 8,
    docket: '143-C',
    title: 'The Forged Notes',
    charge: 'Counterfeiting · $80,000',
    summary:
      'Counterfeit hundred-dollar notes are surfacing across the city. They are unusually high quality — printed on the same press as a local printer’s legal jobs.',
    claim: '“I print wedding invitations and business cards. Half the city rents my presses. I never printed a dollar in my life.”',
    defendant: {
      name: 'Desmond Pike',
      age: 52,
      occupation: 'Commercial Printer',
      look: {
        skin: '#c99b7c', shade: '#a67a5e',
        hair: '#7b6756', hairDark: '#544538',
        outfit: '#5c4a37', outfitDark: '#403226',
        shirt: '#d6c7ac', accent: '#91463f',
        hairStyle: 'sidepart', accessory: 'bowtie', build: 'broad',
      },
    },
    witness: {
      name: 'June Park',
      role: 'Bank Teller',
      look: {
        skin: '#d0a17d', shade: '#aa7e5d',
        hair: '#1f1915', hairDark: '#100c0a',
        outfit: '#384a5d', outfitDark: '#263442',
        shirt: '#ded4be', accent: '#a98548',
        hairStyle: 'bun', accessory: 'glasses', build: 'slim',
      },
      statement:
        'Three notes had the same serial number. I’d seen that ink before — the smudged green edge. The printer is a customer of ours, and he became furious when I flagged it.',
    },
    evidence: {
      title: 'Seized Printing Plates',
      subtitle: 'Locked storage unit · verified',
      icon: 'plates',
      exhibit: 'H',
      detail:
        'Plates for $100 notes recovered from a locked storage unit. The rent is paid from the defendant’s business account. Ink residue on the plates matches a drum in his workshop. $80,000 in finished notes was seized alongside them.',
    },
    truth: 'guilty',
    sentence: 'year10',
    explanation:
      'The plates, the rent, the ink, and the finished notes connect Pike’s workshop to the entire operation. At $80,000, this is far past a fine or a single year. The guidelines demand ten years.',
  },
  {
    id: 9,
    docket: '147-A',
    title: 'The Broken Window',
    charge: 'Vandalism · $600',
    summary:
      'A baseball shatters a neighbor’s window at 5:10 p.m. A retired watchman saw a figure in a red jacket sprint away and identified the defendant.',
    claim: '“I was in detention until 5:30. Coach made us run laps for mouthing off. I wasn’t anywhere near that street.”',
    defendant: {
      name: 'Caleb Moss',
      age: 16,
      occupation: 'Student',
      look: {
        skin: '#8b5a3c', shade: '#6b422b',
        hair: '#241916', hairDark: '#120c0a',
        outfit: '#8a3834', outfitDark: '#662724',
        shirt: '#d8ccb5', accent: '#b38f4d',
        hairStyle: 'curly', accessory: 'none', build: 'slim',
      },
    },
    witness: {
      name: 'Harold Finch',
      role: 'Retired Watchman',
      look: {
        skin: '#c7a084', shade: '#a17d62',
        hair: '#beb7a9', hairDark: '#8d877c',
        outfit: '#4e4a3d', outfitDark: '#363328',
        shirt: '#cfc6b2', accent: '#6d6046',
        hairStyle: 'cap', accessory: 'glasses', build: 'slim',
      },
      statement:
        'A kid in a red hoodie ran right under my lamp. I know Caleb — he wears that jacket every day. He was gone before I could shout.',
    },
    evidence: {
      title: 'Baseball & Detention Slip',
      subtitle: 'Recovered from the room',
      icon: 'baseball',
      exhibit: 'I',
      detail:
        'The baseball recovered from the broken room bears the name “J. Park” in marker. A school detention slip confirms the defendant was in the gymnasium until 5:30 p.m. — twenty minutes after the window was broken.',
    },
    truth: 'innocent',
    sentence: null,
    explanation:
      'Caleb’s detention slip places him across town when the window broke, and the ball belongs to another student. A red jacket was enough to accuse the wrong boy. He is not guilty.',
  },
  {
    id: 10,
    docket: '151-S',
    title: 'The Gala Envelope',
    charge: 'Accepting a Bribe · $50,000',
    summary:
      'A city councilwoman is accused of taking $50,000 in cash from a developer during a charity gala. A journalist says she watched the exchange from across the room.',
    claim: '“He pressed an envelope into my hands. I assumed it was a donation cheque. I handed it to my campaign treasurer before dessert.”',
    defendant: {
      name: 'Ada Sterling',
      age: 44,
      occupation: 'City Councilwoman',
      look: {
        skin: '#70452f', shade: '#553322',
        hair: '#29211e', hairDark: '#161110',
        outfit: '#393947', outfitDark: '#252531',
        shirt: '#e0d6c3', accent: '#c5a052',
        hairStyle: 'updo', accessory: 'brooch', build: 'regular',
      },
    },
    witness: {
      name: 'Nadia Voss',
      role: 'Investigative Reporter',
      look: {
        skin: '#d3a987', shade: '#ad8564',
        hair: '#2b1d18', hairDark: '#170f0c',
        outfit: '#4f4b40', outfitDark: '#35322a',
        shirt: '#cec5b2', accent: '#8c3f39',
        hairStyle: 'long', accessory: 'none', build: 'slim',
      },
      statement:
        'I watched Councilwoman Sterling take a thick envelope from Hollis Grey and slip it into her bag. Grey is a developer with a rezoning application before her committee.',
    },
    evidence: {
      title: 'Audit & Recording',
      subtitle: 'Filed with the election board',
      icon: 'envelope',
      exhibit: 'J',
      detail:
        'The envelope contained five campaign donation cheques, each declared to the election board. Grey was an undercover ethics investigator; his recording captures Sterling refusing cash and asking for a written donation instead. The “bribe” never existed.',
    },
    truth: 'innocent',
    sentence: null,
    explanation:
      'The recording, the audit, and the declared cheques all contradict the accusation. Councilwoman Sterling refused cash and followed campaign-finance law. She is not guilty.',
  },
];
