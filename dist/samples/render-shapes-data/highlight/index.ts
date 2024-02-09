// Initialize and add the map
let map: woosmap.map.Map;

const pubsData = {
  pubs: [
    {
      coordinates: [-6.25886, 53.33972],
      properties: {
        review: "Smallest Pub In Ireland",
        name: "Dawson Lounge",
      },
    },
    {
      coordinates: [-6.23036, 53.329],
      properties: {
        review: "Rugger Bar, but not bad",
        name: "Paddy Cullens",
      },
    },
    {
      coordinates: [-6.23048, 53.32905],
      properties: {
        review: "Can't Remember. Possibly Drunk",
        name: "Crowes Pub",
      },
    },
    {
      coordinates: [-6.24527, 53.33387],
      properties: {
        review: "Decent Boozer. On the Lansdowne route.",
        name: "The Wellington",
      },
    },
    {
      coordinates: [-6.24303, 53.33332],
      properties: {
        review: "Cock Pub. Think its closed.",
        name: "Searsons",
      },
    },
    {
      coordinates: [-6.24276, 53.33788],
      properties: {
        review:
          "Good Pub for pre Ireland match drinks. Always a decent crowd and sometimes free nibbles",
        name: "Scruffy Murphys",
      },
    },
    {
      coordinates: [-6.24317, 53.33837],
      properties: {
        review: "Quiet Pub, nice feel to it.",
        name: "Oil Can Harrys",
      },
    },
    {
      coordinates: [-6.2491, 53.34418],
      properties: {
        review: "Near Pearse St Dart station. Not mad about it.",
        name: "The Lombard",
      },
    },
    {
      coordinates: [-6.25551, 53.34688],
      properties: {
        review: "Auld farts pub. Usually a good crowd",
        name: "Mulligans",
      },
    },
    {
      coordinates: [-6.25589, 53.34741],
      properties: {
        review: "Meh... More of a restaurant bar",
        name: "White Horse",
      },
    },
    {
      coordinates: [-6.27575, 53.34511],
      properties: {
        review:
          "Went in here for a relief pint after the horrifying experience that was The Brazen Head. FUCK YOU AMERICANS",
        name: "O'Sheas The Merchant",
      },
    },
    {
      coordinates: [-6.25753, 53.34568],
      properties: {
        review: "Cunt Pub Cunt Pub Cunt Pub",
        name: "Doyles",
      },
    },
    {
      coordinates: [-6.26441, 53.33164],
      properties: {
        review: "Decent Bar. Pitchers of Buckfast. Ouch",
        name: "George Bernard Shaw",
      },
    },
    {
      coordinates: [-6.25914, 53.34685],
      properties: {
        review: "Da Mhamais hangout",
        name: "Fitzgeralds",
      },
    },
    {
      coordinates: [-6.26346, 53.34583],
      properties: {
        review: "Good Pub. Sometimes have blues lads upstairs",
        name: "Ha'penny Bridge Inn",
      },
    },
    {
      coordinates: [-6.25088, 53.35004],
      properties: {
        review: "Decent Pub. Think its been renamed.",
        name: "Kates Cottage",
      },
    },
    {
      coordinates: [-6.26064, 53.34385],
      properties: {
        review: "Bit of a tourist pub. But not the worst",
        name: "O'Neills",
      },
    },
    {
      coordinates: [-6.25395, 53.33814],
      properties: {
        review: "Good Pub. Proper bar and good night life in the lounge",
        name: "O'Donoghues",
      },
    },
    {
      coordinates: [-6.3168, 53.34029],
      properties: {
        review: "Supersaints Pub. nuff said",
        name: "McDowells",
      },
    },
    {
      coordinates: [-6.32089, 53.33965],
      properties: {
        review: "Good banter after a game",
        name: "Black Lion",
      },
    },
    {
      coordinates: [-6.24896, 53.33687],
      properties: {
        review: "Decent Boozer. A bit isolated",
        name: "Larry Murphys",
      },
    },
    {
      coordinates: [-6.26059, 53.33057],
      properties: {
        review: "Great place to sit on the canal with a pint on a warm day",
        name: "The Barge",
      },
    },
    {
      coordinates: [-6.25564, 53.36753],
      properties: {
        review: "Berties local ;-)",
        name: "Fagans",
      },
    },
    {
      coordinates: [-6.31509, 53.3402],
      properties: {
        review: "Real nice pub. laptop for a jukebox...",
        name: "Taveys",
      },
    },
    {
      coordinates: [-6.33976, 53.34227],
      properties: {
        review: "Has been done up to look like faux Irish pub. tut tut",
        name: "The Laurence",
      },
    },
    {
      coordinates: [-6.26794, 53.3449],
      properties: {
        review: "Czech Beer and Disco Bar...",
        name: "The Czech Inn",
      },
    },
    {
      coordinates: [-6.26767, 53.34479],
      properties: {
        review: "Samba lessons downstairs. WTF",
        name: "Turks Head",
      },
    },
    {
      coordinates: [-6.26041, 53.3523],
      properties: {
        review: "Great Sports Bar",
        name: "Living Room",
      },
    },
    {
      coordinates: [-6.26595, 53.34508],
      properties: {
        review: "Ok bar. Usually has some music",
        name: "Purty Kitchen",
      },
    },
    {
      coordinates: [-6.2568, 53.33572],
      properties: {
        review: "Small Pub off Stephens Green. Good Atmosphere",
        name: "Houricans",
      },
    },
    {
      coordinates: [-6.26506, 53.33435],
      properties: {
        review: "Think this pub might be gone now",
        name: "Cassidys",
      },
    },
    {
      coordinates: [-6.25678, 53.34638],
      properties: {
        review: "Small Pub across from the Cinema. Me Da had his Stag there",
        name: "Chaplains",
      },
    },
    {
      coordinates: [-6.26494, 53.33389],
      properties: {
        review: "Not Bad. Gets a big office crowd",
        name: "The Bleedin' Horse",
      },
    },
    {
      coordinates: [-6.26123, 53.34049],
      properties: {
        review: "Downstairs Pub. Good for matches",
        name: "Sinnots Bar",
      },
    },
    {
      coordinates: [-6.26304, 53.34449],
      properties: {
        review: "COCKtail bar, wont be returning",
        name: "Citi Bar",
      },
    },
    {
      coordinates: [-6.26398, 53.34428],
      properties: {
        review:
          "Weird. Looks like an old Palace or something. Well. A palace that sells beer",
        name: "Mercantile",
      },
    },
    {
      coordinates: [-6.26135, 53.35268],
      properties: {
        review: "Right in the heart. Good for football",
        name: "Murrays",
      },
    },
    {
      coordinates: [-6.26357, 53.34133],
      properties: {
        review: "Decent Pub. Good Area.",
        name: "The Hairy Lemon",
      },
    },
    {
      coordinates: [-6.26357, 53.34116],
      properties: {
        review: "Cant remember. Possibly drunk",
        name: "Peters Pub",
      },
    },
    {
      coordinates: [-6.25949, 53.34594],
      properties: {
        review: "Popular Dubs hangout",
        name: "Buskers Bar",
      },
    },
    {
      coordinates: [-6.26539, 53.34373],
      properties: {
        review: "Tis a pub",
        name: "Brogans",
      },
    },
    {
      coordinates: [-6.26031, 53.3418],
      properties: {
        review: "Check out the Phillo tribute",
        name: "Bruxelles",
      },
    },
    {
      coordinates: [-6.25486, 53.34575],
      properties: {
        review: "Too big. No atmosphere",
        name: "McTurtles",
      },
    },
    {
      coordinates: [-6.34598, 53.34758],
      properties: {
        review: "Good for a pint while waiting for the bus after a Pats match",
        name: "The Bridge Inn",
      },
    },
    {
      coordinates: [-6.27324, 53.3583],
      properties: {
        review: 'Kev: "Worst Pint ever!"',
        name: "The Red Windmill",
      },
    },
    {
      coordinates: [-6.26337, 53.35811],
      properties: {
        review: "Pre Irish Match Pint when they played in Croker",
        name: "Kavanaghs",
      },
    },
    {
      coordinates: [-6.24144, 53.33937],
      properties: {
        review: "Small Pub. Good Atmosphere. Good Paninis",
        name: "Becky Morgans",
      },
    },
    {
      coordinates: [-6.27114, 53.36649],
      properties: {
        review: "Uncle Ronnie!",
        name: "The Botanic House",
      },
    },
    {
      coordinates: [-6.23357, 53.33728],
      properties: {
        review: "Small Pub. Good atmosphere. Great before a Lansdowne match",
        name: "The Lansdowne",
      },
    },
    {
      coordinates: [-6.25336, 53.35077],
      properties: {
        review: "Got the Pints but they didnt have any t-shirts",
        name: "Mother Kellys",
      },
    },
    {
      coordinates: [-6.25527, 53.33356],
      properties: {
        review: "Cock Pub. Only went to crash the ESB Christmas Party.",
        name: "Kobra Bar",
      },
    },
    {
      coordinates: [-6.25307, 53.33855],
      properties: {
        review: "Famous Persons haunt. We didnt see any. Nice pub.",
        name: "Foleys",
      },
    },
    {
      coordinates: [-6.25245, 53.34484],
      properties: {
        review:
          "Put it off for ages because we thought it was closed. May actually be closed now",
        name: "O'Neills",
      },
    },
    {
      coordinates: [-6.26713, 53.35028],
      properties: {
        review: "Aussie Bar. Good seelction of beers. Great for sport",
        name: "Woolshed",
      },
    },
    {
      coordinates: [-6.25076, 53.34217],
      properties: {
        review: "Cunt Pub. Refused Kev for being a scummer. Shall never return",
        name: "Kennedys",
      },
    },
    {
      coordinates: [-6.25568, 53.36716],
      properties: {
        review: "Pre Croker/Shells matches",
        name: "Kennedys",
      },
    },
    {
      coordinates: [-6.26304, 53.34449],
      properties: {
        review: "Kev doesnt like. I do. Contentious",
        name: "The Foggy Dew",
      },
    },
    {
      coordinates: [-6.13341, 53.29352],
      properties: {
        review: "More Restaurant than pub. But we were desperate for a pint...",
        name: "Gastro Pub",
      },
    },
    {
      coordinates: [-6.31906, 53.33978],
      properties: {
        review: "New Pub in Inchicore. A bit too nice looking",
        name: "Tommy Croughs",
      },
    },
    {
      coordinates: [-6.23204, 53.33739],
      properties: {
        review: "Maybe only opens for matches",
        name: "Murrays",
      },
    },
    {
      coordinates: [-6.23665, 53.33665],
      properties: {
        review:
          "Decent Old Looking Pub. Good for a pre match pint. Not too dear",
        name: "The Beggars Bush",
      },
    },
    {
      coordinates: [-6.23415, 53.33716],
      properties: {
        review: "Aliens once abducted Tom from the Bar",
        name: "The Shelbourne House",
      },
    },
    {
      coordinates: [-6.26817, 53.34821],
      properties: {
        review: "Early House on Capel St. Decent",
        name: "Slatterys",
      },
    },
    {
      coordinates: [-6.23415, 53.33716],
      properties: {
        review: "Dont like it. Worst of the pubs near Lansdowne",
        name: "Slatterys",
      },
    },
    {
      coordinates: [-6.24291, 53.3494],
      properties: {
        review: "The Reason Kev flunked out of NCI",
        name: "Laguna",
      },
    },
    {
      coordinates: [-6.24871, 53.34532],
      properties: {
        review: "Classic Old Pub. Watched Michael Jacksons Funeral there",
        name: "Windjammer",
      },
    },
    {
      coordinates: [-6.24897, 53.3497],
      properties: {
        review: "Decent Deals an Savage KPMG burds",
        name: "The Harbour Master",
      },
    },
    {
      coordinates: [-6.22846, 53.32826],
      properties: {
        review: "Nice Pub considering the location",
        name: "Madigans",
      },
    },
    {
      coordinates: [-6.23451, 53.33218],
      properties: {
        review: "Big Pre Croker Pub",
        name: "The Dubliner",
      },
    },
    {
      coordinates: [-6.25264, 53.33791],
      properties: {
        review: "Good old looking pub, right in the heart",
        name: "Toners",
      },
    },
    {
      coordinates: [-6.25669, 53.33592],
      properties: {
        review: "Real classic feel. school desk for tables. Good Pub",
        name: "Hartigans",
      },
    },
    {
      coordinates: [-6.26246, 53.344],
      properties: {
        review: "Small Pub. Comedy Club as well.",
        name: "Bankers",
      },
    },
    {
      coordinates: [-6.41734, 53.38346],
      properties: {
        review: "Big Place. Carvery and shit",
        name: "Clonsilla Inn",
      },
    },
    {
      coordinates: [-6.41888, 53.35852],
      properties: {
        review: "Closed now I believe.",
        name: "The Foxhunter",
      },
    },
    {
      coordinates: [-6.25023, 53.35706],
      properties: {
        review: "They dont trust you with glasses. Says it all really",
        name: "Sunset House",
      },
    },
    {
      coordinates: [-6.26456, 53.35705],
      properties: {
        review: "Small Pub. Good for pre Croker meetups",
        name: "The Findlater",
      },
    },
    {
      coordinates: [-6.23141, 53.32941],
      properties: {
        review: "Red Pub. Worst in Ballsbridge",
        name: "Bellamys",
      },
    },
    {
      coordinates: [-6.24967, 53.34195],
      properties: {
        review: "Masters students hangout. No thanks.",
        name: "The Ginger Man",
      },
    },
    {
      coordinates: [-6.25686, 53.3483],
      properties: {
        review: "Nice Pub. Bit out of the way of the tourist trap",
        name: "The Pint!",
      },
    },
    {
      coordinates: [-6.25758, 53.34875],
      properties: {
        review: "Good for a few post theatre pints",
        name: "Lannigan Plough",
      },
    },
    {
      coordinates: [-6.25959, 53.34617],
      properties: {
        review:
          "Big Pub. Base yourself here and get nibbles from the Epicurean Food Hall",
        name: "The Gin Palace",
      },
    },
    {
      coordinates: [-6.25758, 53.34875],
      properties: {
        review: "They have old kegs for tables. Wahey!",
        name: "The Flowing Tide",
      },
    },
    {
      coordinates: [-6.33114, 53.37246],
      properties: {
        review: "Kev was uncomfortable",
        name: "The Halfway House",
      },
    },
    {
      coordinates: [-6.06617, 53.38736],
      properties: {
        review: "Nice Pub. Has some local Phillo History",
        name: "The Cock Tavern",
      },
    },
    {
      coordinates: [-6.25864, 53.34187],
      properties: {
        review:
          "Gets a good work crowd. Nice and cramped so nonchelant ass grabs can occur",
        name: "The Duke",
      },
    },
    {
      coordinates: [-6.26359, 53.35736],
      properties: {
        review: "They have burger and chips. Big place",
        name: "The Temple",
      },
    },
    {
      coordinates: [-6.2405, 53.34596],
      properties: {
        review: "Nice Pub. Spent the first Arthurs Day there",
        name: "Ferryman",
      },
    },
    {
      coordinates: [-6.25943, 53.34154],
      properties: {
        review: "Gets very busy with shoppers",
        name: "John Keoghs",
      },
    },
    {
      coordinates: [-6.27394, 53.35679],
      properties: {
        review: "Nurses Hangout. Frequent before Boez Scum matches",
        name: "McGowans",
      },
    },
    {
      coordinates: [-6.26275, 53.34384],
      properties: {
        review: "Tiny place. Drink on the streets when its busy",
        name: "Dame Tavern",
      },
    },
    {
      coordinates: [-6.26355, 53.33516],
      properties: {
        review: "Right beside Coppers... Not really a pub",
        name: "Diceys Garden",
      },
    },
    {
      coordinates: [-6.26382, 53.34395],
      properties: {
        review: "Decent pub. Old style feel and a newer downstairs",
        name: "The Stags Head",
      },
    },
    {
      coordinates: [-6.2649, 53.34435],
      properties: {
        review: "Really nice pub. Always good for a bit of music",
        name: "Peader Kearneys",
      },
    },
    {
      coordinates: [-6.26718, 53.34436],
      properties: {
        review: "Cant remember it. Damn gargle dimmed brain",
        name: "Thomas Read",
      },
    },
    {
      coordinates: [-6.26763, 53.34651],
      properties: {
        review: "Decent Pub. Classic feel to it",
        name: "Nealons",
      },
    },
    {
      coordinates: [-6.26822, 53.34737],
      properties: {
        review: "Small bar. Good for a few pints and a natter",
        name: "The Boars Head",
      },
    },
    {
      coordinates: [-6.26814, 53.34775],
      properties: {
        review: "Honestly thought this place was a music shop",
        name: "McNeills",
      },
    },
    {
      coordinates: [-6.26399, 53.34856],
      properties: {
        review: "Must have been pissed. I cant remember it",
        name: "The Lotts",
      },
    },
    {
      coordinates: [-6.2541, 53.34727],
      properties: {
        review:
          "Rock bar sporting the wheel of death. Right under a tara street station as well, so a good atmosphere",
        name: "O'Reillys",
      },
    },
    {
      coordinates: [-6.24369, 53.34323],
      properties: {
        review: "Generic hotel bar. Not Great",
        name: "Green Room",
      },
    },
    {
      coordinates: [-6.27142, 53.34572],
      properties: {
        review:
          "The New Fibbers on the Quays. Grand if you fancy a bit of Metal with ur pint",
        name: "Fibbers Rock Bar",
      },
    },
    {
      coordinates: [-6.27232, 53.34574],
      properties: {
        review:
          "Went in hoping to see some high class lawyer pussy. Alas, none was forthcoming",
        name: "Legal Eagle",
      },
    },
    {
      coordinates: [-6.24884, 53.35146],
      properties: {
        review: "Under Connolly train station. Good drink deals",
        name: "The Vault",
      },
    },
    {
      coordinates: [-6.26024, 53.34861],
      properties: {
        review: "Nice old feel to the bar. Nip in when the Mrs is off shopping",
        name: "The Oval",
      },
    },
    {
      coordinates: [-6.2732, 53.35875],
      properties: {
        review: "Nip in for a quick one before the Boez game",
        name: "Phibsboro House",
      },
    },
    {
      coordinates: [-6.27307, 53.36091],
      properties: {
        review: "Another one before a Boez game",
        name: "The Bohemian",
      },
    },
    {
      coordinates: [-6.24174, 53.40161],
      properties: {
        review:
          "Pints before a Pats match against Sporting Fingal. Unfortunately they went out of business (the football club I mean)",
        name: "Swiss Cottage",
      },
    },
    {
      coordinates: [-6.30756, 53.34174],
      properties: {
        review: "So close to Inchicore yet it took us ages to do it.",
        name: "The Patriots",
      },
    },
    {
      coordinates: [-6.23047, 53.32905],
      properties: {
        review: "In good company. Good for pre Lansdowne or RDS meetup",
        name: "Mary Macs",
      },
    },
    {
      coordinates: [-6.23525, 53.3217],
      properties: {
        review: "Donnybrook pub. At least its not as bad as the other ones",
        name: "Longs",
      },
    },
    {
      coordinates: [-6.23656, 53.32221],
      properties: {
        review: "Ughh. Did it just to get it off the list",
        name: "Kielys",
      },
    },
    {
      coordinates: [-6.25723, 53.35493],
      properties: {
        review: "Always great craic before a Dubs match",
        name: "Hill 16",
      },
    },
    {
      coordinates: [-6.26173, 53.35905],
      properties: {
        review: "Went jingle Jangle",
        name: "Auld Triangle",
      },
    },
    {
      coordinates: [-6.26093, 53.35979],
      properties: {
        review: "Good auld pub on a busy street for good pubs",
        name: "The Big Tree",
      },
    },
    {
      coordinates: [-6.25287, 53.35039],
      properties: {
        review: "Waiting for the Bus? Have a pint!",
        name: "Robert Reade",
      },
    },
    {
      coordinates: [-6.25966, 53.36105],
      properties: {
        review: "Classic auld boozer",
        name: "The Red Parrot",
      },
    },
    {
      coordinates: [-6.26551, 53.34064],
      properties: {
        review: "Good bar for a bit of blues upstairs. Fairly small though",
        name: "JJ Smyths",
      },
    },
    {
      coordinates: [-6.26463, 53.34205],
      properties: {
        review: "Big enough bar. Was most likely pissed when I was there",
        name: "Hogans",
      },
    },
    {
      coordinates: [-6.22777, 53.34172],
      properties: {
        review: "Nice boozer. Close to lansdowne and a good local atmosphere",
        name: "The Oarsman",
      },
    },
    {
      coordinates: [-6.24478, 53.34084],
      properties: {
        review: "Can find many a proud man wetting the babys head in here",
        name: "Doolans",
      },
    },
    {
      coordinates: [-6.24243, 53.33463],
      properties: {
        review: "Tis a pub with beer. good enough by me",
        name: "The 51",
      },
    },
    {
      coordinates: [-6.13497, 53.24518],
      properties: {
        review:
          "Ah the Tassie... Possibly the Best Pub in the world... Ever...",
        name: "The Silver Tassie",
      },
    },
    {
      coordinates: [-6.24345, 53.33477],
      properties: {
        review: "What can I say... Its across the road from 51",
        name: "Smyths",
      },
    },
    {
      coordinates: [-6.45023, 53.35719],
      properties: {
        review: "Nice Pub. Kind of a food place though",
        name: "Kennys",
      },
    },
    {
      coordinates: [-6.4545, 53.35541],
      properties: {
        review: "Dont drive home drunk from this place",
        name: "Ball Alley House",
      },
    },
    {
      coordinates: [-6.45023, 53.35626],
      properties: {
        review:
          "Right next door to a Garda station. How are you meant to enjoy a late pint in peace?",
        name: "Courtneys",
      },
    },
    {
      coordinates: [-6.22353, 53.34003],
      properties: {
        review: "Pre match pint. Was a bit of a shithole",
        name: "Doyles",
      },
    },
    {
      coordinates: [-6.22783, 53.34235],
      properties: {
        review: "Like having a pint in someones living room.",
        name: "The Yacht",
      },
    },
    {
      coordinates: [-6.24485, 53.34339],
      properties: {
        review: "A real local...",
        name: "Padraig Pearse",
      },
    },
    {
      coordinates: [-6.25035, 53.35128],
      properties: {
        review: "Near to Connolly train station",
        name: "Graingers",
      },
    },
    {
      coordinates: [-6.26088, 53.35298],
      properties: {
        review:
          "Mix of Koreans and Dubs. Kinda weird. But still cool. Has a Korean Restaurant as well.",
        name: "Hop House",
      },
    },
    {
      coordinates: [-6.51871, 53.31813],
      properties: {
        review: "Lovely setting but a few too many land rovers for my liking",
        name: "The Hatch",
      },
    },
    {
      coordinates: [-6.25281, 53.34268],
      properties: {
        review: "Surrounded by Trinners Winners... Wahey!",
        name: "The Pavillion",
      },
    },
    {
      coordinates: [-6.29275, 53.34666],
      properties: {
        review: "Grand for a few pints before the train. A bit pricey...",
        name: "The Galway Hooker",
      },
    },
    {
      coordinates: [-6.45184, 53.34135],
      properties: {
        review: "Big Roomy Pub in the middle of a soulless megaestate",
        name: "The Lord Lucan",
      },
    },
    {
      coordinates: [-6.46564, 53.28195],
      properties: {
        review: "Nice local Big pub",
        name: "Muldowneys",
      },
    },
    {
      coordinates: [-6.2154, 53.33243],
      properties: {
        review:
          "Not bad, maybe a bit snobby but had a nice fire and decent pints",
        name: "Sandymount House",
      },
    },
    {
      coordinates: [-6.21613, 53.33301],
      properties: {
        review: "Fuckin Piano Bar, didnt like the buzz of this place",
        name: "Mulligans",
      },
    },
    {
      coordinates: [-6.39261, 53.32104],
      properties: {
        review:
          "Good Size Pub, Decent crowd in on a Sunday. Too many floor staff though..",
        name: "The Laurels",
      },
    },
    {
      coordinates: [-6.23872, 53.31419],
      properties: {
        review:
          "Nice boozer. Big car park and gets a good sized after work crowd",
        name: "O'Sheas",
      },
    },
    {
      coordinates: [-6.23702, 53.31614],
      properties: {
        review: "More wine bar than pub. Full of tosspots",
        name: "Ashtons",
      },
    },
    {
      coordinates: [-6.25196, 53.34603],
      properties: {
        review: "Good pub. Real down to earth, and good prices.",
        name: "Neds",
      },
    },
    {
      coordinates: [-6.1536, 53.45127],
      properties: {
        review: "James' first pub. So I suppose it'll always have that",
        name: "Gibneys",
      },
    },
    {
      coordinates: [-6.25011, 53.32331],
      properties: {
        review:
          "Watched the 2014 World Cup draw here. Good pub later in the night",
        name: "McSorleys",
      },
    },
    {
      coordinates: [-6.25028, 53.32338],
      properties: {
        review: "Full of old people but they do a mean toasted cheese sangidge",
        name: "Birchalls",
      },
    },
    {
      coordinates: [-6.25252, 53.32424],
      properties: {
        review:
          "Alright Pub. Although they have cock rings on sale in the jacks which is a bit much",
        name: "Smyths",
      },
    },
    {
      coordinates: [-6.25129, 53.32386],
      properties: {
        review: "Grand pub. Friendly staff.",
        name: "Humphreys",
      },
    },
    {
      coordinates: [-6.2544, 53.32504],
      properties: {
        review: "Craft Beer and nice food. The new revolution apparently.",
        name: "Tap House",
      },
    },
    {
      coordinates: [-6.25303, 53.33799],
      properties: {
        review:
          "Good launching location in central dublin. Bar is usually busy too",
        name: "Doheny & Nesbitts",
      },
    },
    {
      coordinates: [-6.26423, 53.34122],
      properties: {
        review: "Free Stinger bars, although maybe they werent free",
        name: "P. Macs",
      },
    },
    {
      coordinates: [-6.13875, 53.29337],
      properties: {
        review: "One of the forgotten bars in Dun Laoghaire. Cowboy joined us.",
        name: "Dunphys",
      },
    },
    {
      coordinates: [-6.44963, 53.35731],
      properties: {
        review:
          "Not really a pub, its a gastro pub... And it has a feckin tea menu.",
        name: "Carrols",
      },
    },
    {
      coordinates: [-6.46487, 53.35618],
      properties: {
        review: "Any pub that has a Pats scarf on the wall is alright by me",
        name: "The Lucan County",
      },
    },
    {
      coordinates: [-6.19662, 53.30881],
      properties: {
        review: "Not a bad boozer. Some craft beers and free crisps.",
        name: "The Punch Bowl",
      },
    },
    {
      coordinates: [-6.19759, 53.30549],
      properties: {
        review: "Fuckin cunt hole",
        name: "Gleesons",
      },
    },
    {
      coordinates: [-6.21121, 53.31842],
      properties: {
        review: "Kind of a restaurant and in a shit location anyways",
        name: "The Merrion Inn",
      },
    },
    {
      coordinates: [-6.26741, 53.34506],
      properties: {
        review: "Typical Porterhouse, full of tourists",
        name: "The Porterhouse",
      },
    },
    {
      coordinates: [-6.26154, 53.34417],
      properties: {
        review: "Posh Posh Posh",
        name: "The Bank on the Green",
      },
    },
    {
      coordinates: [-6.36212, 53.28793],
      properties: {
        review:
          "Went here before the Pats v Legia game. Grand pub, was early though so no atmosphere",
        name: "The Dragon",
      },
    },
    {
      coordinates: [-6.35959, 53.28807],
      properties: {
        review:
          "Good big pub. Was there early during the day but still a few in.",
        name: "Molloys",
      },
    },
    {
      coordinates: [-6.26547, 53.3211],
      properties: {
        review:
          "Surprisingly big pub. was dead when we were there but I'd say its a good laugh at night",
        name: "Rody Bolands",
      },
    },
    {
      coordinates: [-6.26567, 53.32178],
      properties: {
        review:
          "Love the name.. Cop On.. Good selection of craft beer but a small smell of tosspot off the place",
        name: "Copan",
      },
    },
    {
      coordinates: [-6.26629, 53.32184],
      properties: {
        review: "A real auld fellas pub. Dark and Dingey... I love it.",
        name: "Graces",
      },
    },
    {
      coordinates: [-6.2659, 53.32214],
      properties: {
        review:
          "An alright pub. Didnt seem to be full of muppets but didnt have anything special",
        name: "Slatterys",
      },
    },
    {
      coordinates: [-6.26476, 53.32693],
      properties: {
        review:
          "Yeah.. eh... They had a fuckin bed for a table... Maybe I'm just getting old",
        name: "Blackbird",
      },
    },
    {
      coordinates: [-6.24235, 53.36265],
      properties: {
        review:
          "I have absolutely zero recollection about this place... my bad...",
        name: "Meaghers",
      },
    },
    {
      coordinates: [-6.26512, 53.32432],
      properties: {
        review: "More cafe than pub. Who calls a pub toast... come on.",
        name: "Toast",
      },
    },
    {
      coordinates: [-6.25967, 53.3459],
      properties: {
        review:
          "Tipp bar. Not bad. Good crowd. One for firsts. First Dublin Porter on tap and first pub logged on the app",
        name: "Palace Bar",
      },
    },
    {
      coordinates: [-6.17685, 53.30073],
      properties: {
        review:
          "First Wetherspoons in the Republic. Wasn't bad. Decent food and definitely cheap drink but dunno if I'd like it as me local... Strange atmosphere",
        name: "Three Tun Tavern",
      },
    },
    {
      coordinates: [-6.17763, 53.30151],
      properties: {
        review:
          "Tiny pub. Was pretty good actually. Relaxed and books and shit in the window",
        name: "O'Donohoes",
      },
    },
    {
      coordinates: [-6.17779, 53.30161],
      properties: {
        review: "Snobby shit hole...",
        name: "Jack O'Rourkes",
      },
    },
    {
      coordinates: [-6.29407, 53.34832],
      properties: {
        review: "Nice pub. Bit touristy.",
        name: "Nancy Hands",
      },
    },
    {
      coordinates: [-6.2934, 53.34819],
      properties: {
        review:
          "Good pub. Real auld fart feel to it. Owner is very proud of his Limerick hurling background also.",
        name: "Eamon Reas",
      },
    },
    {
      coordinates: [-6.2701, 53.34331],
      properties: {
        review:
          "Nearly 14 quid for a pint and a long neck. WTF. Rip off merchants.... And the cunts barred me from upstairs.... Grrrrrr....",
        name: "Bull & Castle",
      },
    },
    {
      coordinates: [-6.27021, 53.34299],
      properties: {
        review:
          "Decent boozer. A bit quiet but nice and relaxed. Plus there's a Leo Burdocks around the corner. Score.",
        name: "Lord Edward",
      },
    },
    {
      coordinates: [-6.26833, 53.34386],
      properties: {
        review:
          "Kind of a hotel bar but pretty nice feel to it. Grand for a pint before popping into the Olympia for some legitimate theatre.",
        name: "Legends",
      },
    },
    {
      coordinates: [-6.25213, 53.33836],
      properties: {
        review:
          "Snobby snobby snobby... Not the type of place you'd feel comfortable having a pint and a packet of crisps.",
        name: "McGrattans",
      },
    },
    {
      coordinates: [-6.29356, 53.34805],
      properties: {
        review:
          "Alright pub, nice view out the window. But no crisps or nuts except for some home made crazy expensive jars of nuts... wtf...",
        name: "Ryans",
      },
    },
    {
      coordinates: [-6.2604, 53.34286],
      properties: {
        review:
          "Bags of sugar and jams of jar behind the bar designed to make the hipsters feel like they're drinkin down in some shithole in Kerry without having to risk being away from <insert favourite coffee shop here> for too long.",
        name: "Marys Hardware",
      },
    },
    {
      coordinates: [-6.26861, 53.37335],
      properties: {
        review:
          "Nice pub. Right beside the Botanic Gardens which are beautiful. More of a gastro pub. Probably grand if you want to bring the Granny out for a Sunday Roast",
        name: "Tolla House",
      },
    },
    {
      coordinates: [-6.23562, 53.32162],
      properties: {
        review:
          "Trendy. A load of cameras. Bit quiet though. But they did give me free beer with me lunch. I'll give it a mediocre 3 thumbs up",
        name: "Arthur Maynes",
      },
    },
    {
      coordinates: [-6.22318, 53.3387],
      properties: {
        review: "Tis grand sure. Bice pub. Tree tarded bar peoples....",
        name: "The village Inn",
      },
    },
    {
      coordinates: [-6.22261, 53.33914],
      properties: {
        review: "Nice pub. Good auld fella feel....",
        name: "Beach Tavern",
      },
    },
    {
      coordinates: [-6.22314, 53.33856],
      properties: {
        review: "Dickheads",
        name: "Sober Lane",
      },
    },
    {
      coordinates: [-6.25041, 53.35381],
      properties: {
        review:
          "Grand pub. Was early in the day and lashing so just happy to get a pint in a dry place. Would come again.",
        name: "Lloyds",
      },
    },
    {
      coordinates: [-6.24842, 53.35273],
      properties: {
        review:
          "Ooh Ahh Up The Ra... Auld farts bar. Kev said Don't  forget your Easter Lilly",
        name: "Mulletts",
      },
    },
    {
      coordinates: [-6.2502, 53.35268],
      properties: {
        review: "Choo Choo. Lots of model trains. Nice layout good boozer.",
        name: "J&M Clearys",
      },
    },
    {
      coordinates: [-6.23039, 53.42506],
      properties: {
        review:
          "Can barely count it. Only had a glass of Guinness. But we were here. Violet O'Sheas birthday. Kinda remote. Cant see meself being back.",
        name: "Kealys",
      },
    },
    {
      coordinates: [-6.2658, 53.33692],
      properties: {
        review:
          "Shit pub. There was nobody there. Although they did have a lovely Christmas Ale... \u263a",
        name: "The Jar",
      },
    },
    {
      coordinates: [-6.28164, 53.34318],
      properties: {
        review:
          "Bit hipstery. No TV for the footie wtf. Decent selection of beers though",
        name: "Arthurs",
      },
    },
    {
      coordinates: [-6.28729, 53.34323],
      properties: {
        review: "More brewery than pub. Really enjoyed it in there",
        name: "Open Gate Brewery",
      },
    },
    {
      coordinates: [-6.29729, 53.26499],
      properties: {
        review:
          "More restaurant than pub but really nice for a tourist pub. Good food.",
        name: "Merry Ploughboy",
      },
    },
    {
      coordinates: [-6.28897, 53.35714],
      properties: {
        review:
          "For some reason Dad is petrified of this place. Must be the Boez proximity. Was grand. Tried Roundstone Ale. Have never had it before",
        name: "Hanlons",
      },
    },
    {
      coordinates: [-6.28203, 53.30994],
      properties: {
        review:
          "Alright feel. Was early in the day but had a nice creamy pint and the racing on the telly. There was a weird fella who followed Kev into the jacks over a newspaper though...",
        name: "Bradys",
      },
    },
    {
      coordinates: [-6.28334, 53.30999],
      properties: {
        review:
          "Good boozer for the racing. Was the birth place of James Joyces mother don't ya know.",
        name: "Vaughans",
      },
    },
    {
      coordinates: [-6.27457, 53.3121],
      properties: {
        review:
          "Toss pot craft beer pub. I like the beer but can't take to the atmosphere.... \ud83d\ude20",
        name: "The 108",
      },
    },
    {
      coordinates: [-6.28029, 53.34726],
      properties: {
        review:
          "Nice local feel to the place. Pint of Guinness and a bag of nobbys nuts for a fiver, not fuckin bad.",
        name: "McGettigans",
      },
    },
    {
      coordinates: [-6.28038, 53.34709],
      properties: {
        review:
          "Too hipsterish. Bar man was trying too hard to be cool. Not a fan",
        name: "Dice Bar",
      },
    },
    {
      coordinates: [-6.28008, 53.34701],
      properties: {
        review:
          "Nice feel to the bar. Pool table at the back. And.... This was our 200th pub. Fuck yeah",
        name: "Frank Ryan's",
      },
    },
    {
      coordinates: [-6.2785, 53.34982],
      properties: {
        review:
          "Nice roomy pub. Good smoking area out the back. And the old dude collecting the glasses seemed a bit mad.. I likey",
        name: "Delaneys",
      },
    },
    {
      coordinates: [-6.27785, 53.34981],
      properties: {
        review:
          "Touristy bar. Always have a bit of diddley-eye-dil-eye but wouldn't really settle in here for the evening",
        name: "Cobblestone",
      },
    },
    {
      coordinates: [-6.2803, 53.34601],
      properties: {
        review:
          "Czechsolvanian bar, nearly a restaurant. Bar man didn't even know Ireland were playing. But at least they had some nice different beers.",
        name: "Pifko",
      },
    },
    {
      coordinates: [-6.26011, 53.34728],
      properties: {
        review:
          "Kip. Loud music. No people cept for the drunk lad chuxkin coins into the stupid machine. There's possibly a metaphor in there....",
        name: "Bachelor Inn",
      },
    },
    {
      coordinates: [-6.26024, 53.3474],
      properties: {
        review:
          "Nice roomy bar. Cool looking tunnel design. Some shit singer song writer while we were there but hey...  they had beer.",
        name: "O'Connell Bar",
      },
    },
    {
      coordinates: [-6.23885, 53.34356],
      properties: {
        review:
          "Where do I start with this cunt hole...  The door to the jacks looks like a wall and you have to push the left hand side to open it. They left Kev waiting for fuckin ever for just a bottle of beer and a vodka. Oh... And it's full of tossers...",
        name: "Cafe H",
      },
    },
    {
      coordinates: [-6.26505, 53.33049],
      properties: {
        review:
          "I like this place. Proper auld fella boozer feel to it. Drink was grand. Barman was good....  7 thumbs up",
        name: "The Lower Deck",
      },
    },
    {
      coordinates: [-6.26407, 53.33031],
      properties: {
        review:
          "Not bad.  Front bar is better than the lounge. A few dick tourists in but that was offset by some bang on locals...",
        name: "The Portobello",
      },
    },
    {
      coordinates: [-6.25036, 53.3309],
      properties: {
        review:
          "Bit of an auld jazz bar. If you 30 - 40 and past ur best but still think you're cool,  this is the cunt hole for you.",
        name: "The Leeson Lounge",
      },
    },
    {
      coordinates: [-6.25157, 53.33138],
      properties: {
        review:
          "May be full of auld ones but it's a proper pub. Barmen know what their doing....  COYBIG",
        name: "O'Briens",
      },
    },
    {
      coordinates: [-6.25506, 53.30802],
      properties: {
        review:
          "Good bar. Chatty bar man and nice look to the place. Old trinkets and shit. A little isolated though",
        name: "The Dropping Well",
      },
    },
    {
      coordinates: [-6.24657, 53.2952],
      properties: {
        review:
          "Nithing wrong with the place but was absolutely empty. Shit atmosphere",
        name: "Uncle Toms Cabin",
      },
    },
    {
      coordinates: [-6.2434, 53.28938],
      properties: {
        review:
          "Bar seemed alright but lounge was a little too fancy. Too many eating food to be comfortable. Really hot bar girl though",
        name: "Dundrum House",
      },
    },
    {
      coordinates: [-6.24322, 53.28907],
      properties: {
        review:
          "Nice down to earth bar and lounge. Darts team in the corner. Decent drink selection... not bad...",
        name: "The Eagle",
      },
    },
    {
      coordinates: [-6.25695, 53.29505],
      properties: {
        review:
          "Shit new age shite hole... fuckin leopard skin chairs and stuff. Cock hole",
        name: "The Bottle Tower",
      },
    },
    {
      coordinates: [-6.25559, 53.34598],
      properties: {
        review:
          "The drink is fuckin expensive here. Its an old haunt of me aul fella and its close to the dart, so good location, good selection of beers but mug prices.",
        name: "The Long Stone",
      },
    },
    {
      coordinates: [-6.10728, 53.27812],
      properties: {
        review:
          "A bit posh looking. Price of a pint was alright though. They showed the football and the bar girl was nice and chatty. Dont get served by the dickhead with the slicked back hairdo",
        name: "The Daffy Duck",
      },
    },
    {
      coordinates: [-6.10515, 53.27778],
      properties: {
        review: "Snobby foodatorium. Shithole with a retard barman",
        name: "The Queens",
      },
    },
    {
      coordinates: [-6.10475, 53.27756],
      properties: {
        review:
          "Not bad, good crowd, showed the footy. Barman was good. No complaints... Wuda liked to stay longer",
        name: "The Kings Inn",
      },
    },
    {
      coordinates: [-6.10324, 53.27708],
      properties: {
        review:
          "Nice. Feels closest to a proper pub in the town so far. Bit of a craft bar but nice layout and they have bacon fries... :)",
        name: "The Magpie Inn",
      },
    },
    {
      coordinates: [-6.10308, 53.27646],
      properties: {
        review:
          "Good crowd in the pub. Cuda showed the match on more TVs but seemed a good buzz in the place. Oh and the ridiculously young bargiel had an ass that Kev said he would nuke Tahiti for. I mean.. it was nice like... but it was prob more to do with the fact that she was wearin them skin tight pants which push the ass up. I definitely wouldnt say no meself. But I'd prob need a longer view before I could say whether or not nuking Tahiti was actually justified. Who even knows anyone from Tahiti. Fuck Tahiti. Pretentious cunts...",
        name: "Finnegans",
      },
    },
    {
      coordinates: [-6.23947, 53.33733],
      properties: {
        review:
          "Nice layout and feel to the palce but the bar stuff were fuckin clueless. Kev seemed to like it though.",
        name: "The Schoolhouse",
      },
    },
    {
      coordinates: [-6.23737, 53.33808],
      properties: {
        review:
          "Great selection of craft beer. Bit pricey, but perfect location for a sneaky one on the way to the train station. TBH, I can't actually remember being here with Kev but he swears we were in it. Must've been drunk. \u00af\\_(\u30c4)_/\u00af",
        name: "Gasworks",
      },
    },
    {
      coordinates: [-6.36243, 53.37294],
      properties: {
        review:
          "Hard to judge. Place was empty due to renovations. Certainly plenty of room in the place and the Guinness was alright, so... meh...",
        name: "Myos",
      },
    },
    {
      coordinates: [-6.3677, 53.384],
      properties: {
        review:
          "Big generic gastro pub. If you've been in one you've been in them all. Nice tiles on the ceiling I suppose.",
        name: "Bradys",
      },
    },
    {
      coordinates: [-6.25894, 53.36261],
      properties: {
        review:
          "Really impressed. Nice layout, lovely food. They dropped Kevs burger on the ground but fuck it... it was Kevs burger. Good fuckin pub. I'll be back.",
        name: "McGraths",
      },
    },
    {
      coordinates: [-6.25801, 53.36359],
      properties: {
        review:
          "Nice boozer. Local. Barman fuckin hates 12 pubs of Christmas people.... he possibly hates everyone",
        name: "Quinns",
      },
    },
    {
      coordinates: [-6.26579, 53.35562],
      properties: {
        review:
          "Grand bar, Darts team playin away. We figured out the 10 Alans who played for Ireland between 2000 and 2017. Hint, there's only 9.",
        name: "Delahuntys",
      },
    },
    {
      coordinates: [-6.26591, 53.35549],
      properties: {
        review:
          "Good pub, roomy. Pool table... Beer... I don't fuckin know, no obvious cunts anyways",
        name: "Wellington",
      },
    },
    {
      coordinates: [-6.26524, 53.355841],
      properties: {
        review:
          "The jacks are down in an auld WWII bomb shelter... which smells like WWII piss. But it's the official Irish Spurs supporters club pub (and all three of them were even in tonight) so Kev insisted we give it our highest rating ever... 7 thumbs up!",
        name: "Mayes",
      },
    },
    {
      coordinates: [-6.26609, 53.355244],
      properties: {
        review:
          "Good pub. A bit RA. Proclamations and portraits of Collins all over the gaff but a nice fire down the back. Kev reckons one of the old lads at the bar thought we were cops... :-P",
        name: "Joxer Dalys",
      },
    },
    {
      coordinates: [-6.12431, 53.230068],
      properties: {
        review:
          "Nice pub. Plenty of room, racing on the telly. Was early so was a bit quiet and Kev had his under armour on so was sweating balls but no complaints about the place or the price.",
        name: "Bradys",
      },
    },
    {
      coordinates: [-6.281042, 53.343316],
      properties: {
        review:
          "Real local. Kids in the corner with the bottle of seven up. reminds me of me own youth... How sad... Pint was fine. Lots of pix about the Titanic so maybe the owner has some interest in that.",
        name: "Agnes Brownes",
      },
    },
    {
      coordinates: [-6.288514, 53.342493],
      properties: {
        review:
          "I like it. Nice mix of locals and people working in Guinesses. Big mural across the road about some IRA lad who used to drink there.",
        name: "Harkins The Old Harbour",
      },
    },
    {
      coordinates: [-6.289117, 53.343532],
      properties: {
        review:
          "Was in the middle of renovations so was in a bit of a mess. Small place but good buzz. A few in even though it was early.",
        name: "McCanns Bar",
      },
    },
    {
      coordinates: [-6.290492, 53.343464],
      properties: {
        review:
          "Looks like its been recently done up. Tons of photos on the ceiling so you won't be bored when you fall over..",
        name: "J.K. Stoutmans",
      },
    },
    {
      coordinates: [-6.290975, 53.34296],
      properties: {
        review:
          "Ha, I love this place. Belting out the classics at half 5. Good barmen. Big enough pub as well... Has everything going for it.",
        name: "The Malth House",
      },
    },
    {
      coordinates: [-6.294543, 53.342405],
      properties: {
        review:
          "Very big pub. Was a bit quiet when we were there. No issues with the pint or the crisps.",
        name: "Kennys",
      },
    },
    {
      coordinates: [-6.252509, 53.342057],
      properties: {
        review:
          "Bit of a snobby crowd but there was a cracker of a burd drinkin a pint of Guinness while the lad she was with had the white wine Chardonay or some shite. Kev fell in love with her and instantly wanted to rescue her from the menstruatin muppet. Plus they had the volume turned up for the match so a decent score for this place.",
        name: "The Lincoln Inn",
      },
    },
    {
      coordinates: [-6.261744, 53.343122],
      properties: {
        review:
          "Was alright. Considering the company of pubs in the area, this place is a bit of a safe haven. Had the match on. A few tourists in. Can't really say much beyond that.",
        name: "The International Bar",
      },
    },
    {
      coordinates: [-6.262119, 53.343131],
      properties: {
        review:
          "Meh. Nice marble bar. Nicely dressed people drinking their nicely presented gins in their nicely expensive glasses. Just too.... nice...",
        name: "The Old Stand",
      },
    },
    {
      coordinates: [-6.261974, 53.342915],
      properties: {
        review:
          "Was quiet. Empty really. Hard to get a feel for the place. Barman wasn't a complete knob jockey but they didnt have the match on. Why u no like football....",
        name: "Johnny Rushes",
      },
    },
    {
      coordinates: [-6.262908, 53.342785],
      properties: {
        review: "Fuckin arsehole barman can't take a joke.",
        name: "The Rag Trader",
      },
    },
    {
      coordinates: [-6.262327, 53.342668],
      properties: {
        review:
          "I think The Rag Trader backs on to this place. They must be the same place. Both shite anyways...",
        name: "Dakota",
      },
    },
    {
      coordinates: [-6.264284, 53.34334],
      properties: {
        review:
          "Didn't really see the place. Met an old friend at the bar and was just yappin to him for a while instead. Seemed alright... No match though. Just play the fuckin amatch...",
        name: "The Globe",
      },
    },
    {
      coordinates: [-6.265308, 53.341849],
      properties: {
        review:
          "Small bar. Always busy. Kev didn't like it. I did. If ya can secure a little corner for yourself, it's certainly\u00a0not the worst.",
        name: "The Long Hall",
      },
    },
    {
      coordinates: [-6.205843, 53.371012],
      properties: {
        review:
          "Big place. Seemed to be the only boozer in the town. Attentive bar staff, racing on the telly, bacon fries and lovely slurpy Guinness.... What's not to like?",
        name: "Beachcomber",
      },
    },
    {
      coordinates: [-6.216601, 53.367197],
      properties: {
        review:
          "Another big one. Really cool layout to the bar. Runs along three little snugs.  Large smoking area. A bit too expensive though.",
        name: "Harry Byrnes",
      },
    },
    {
      coordinates: [-6.227163, 53.367853],
      properties: {
        review:
          "Nice place. They serve either peas or beans.... So you've a fuck ton of choice.",
        name: "Graingers",
      },
    },
    {
      coordinates: [-6.228875, 53.365788],
      properties: {
        review:
          "Had to play hide and seek with the bar man for a little while but apart from that was grand. Plenty of room. Nice pints and SCAMPI FRIES.... YAY",
        name: "Kavanaghs",
      },
    },
    {
      coordinates: [-6.262716, 53.346026],
      properties: {
        review:
          "What kind of a cunt hole can charge 14 euro for two bottles of piss and keep a straight face. Some poor fuckin tourist got quoted 85 quid for a single measure. Rip off central. Shall not be back...",
        name: "Merchants Arch",
      },
    },
    {
      coordinates: [-6.258454, 53.346872],
      properties: {
        review:
          "Meh... Over the hill hangout. And Kev reckons the barman was the cunt from Doyles",
        name: "River Bar",
      },
    },
    {
      coordinates: [-6.258131, 53.347011],
      properties: {
        review:
          "Not a bad bar. Jacks are up 27 flights of stairs which is a bit annoyin and their own Stout is utter piss but the place is grand. Very central so gets a crowd.",
        name: "Sweetmans",
      },
    },
    {
      coordinates: [-6.394, 53.35269],
      properties: {
        review:
          "More restaurant than bar. Location does nothing for it. Staff were nice though... Can't see meself being here again unless I'm trying to escape a shopping trip.",
        name: "Hudson",
      },
    },
    {
      coordinates: [-6.321399, 53.339533],
      properties: {
        review:
          "Kev was a Meh... I was a little less impressed. Trying too much to be a restaurant kills the bar atmosphere. Not great tbh...",
        name: "The Richmond",
      },
    },
    {
      coordinates: [-6.310706, 53.340704],
      properties: {
        review:
          "I can't remember this at all. Kev assures me we did it though. Apparently the smoking ban was optional in there...",
        name: "The Geln of Aherlow",
      },
    },
    {
      coordinates: [-6.139319, 53.294701],
      properties: {
        review:
          "I liked this pub. A few in watching the racing, barman offered to sell me tennis balls. Friendly locals....",
        name: "McKennas",
      },
    },
    {
      coordinates: [-6.140055, 53.293926],
      properties: {
        review:
          "Auld fart bar. Good old country bar look to the place. Jacks are out the back somewhere. Yappy enough punters",
        name: "O'Loughlins",
      },
    },
    {
      coordinates: [-6.137471, 53.292989],
      properties: {
        review:
          "Kev was put off by all the board games. Bit expensive as well. But they had a pic of Phillo behind the bar so some saving grace at least. A little too hipster for the tastes though",
        name: "The Lighthouse",
      },
    },
    {
      coordinates: [-6.135145, 53.29178],
      properties: {
        review:
          "Wouldnt be a massive fan. Nothing wrong with the place when we were in, it just seemed a little too nice. fancy carpets... fancy lighting... meh",
        name: "O'Neills",
      },
    },
    {
      coordinates: [-6.130662, 53.290068],
      properties: {
        review:
          "Must be the local celebrity hang out. Saw PJ Gallagher in there. Although the fact that he's Boez Scum has to drag the place down in terms of points. Drink was grand though",
        name: "McLoughlins",
      },
    },
    {
      coordinates: [-6.134219, 53.292478],
      properties: {
        review:
          "As in Laurel and fuckin Hardy... This one is a bit controversial. First things first, it was a snobbish cunt hole that ya wouldnt feel comfortable drinking in anyways... But the controversial thing is that its basically a hotel bar. And the rules specifically state that hotel bars arent allowed. I wanted very much to exclude this place from the list but I checked the revenue site and apparently they are operating under a pub license, so... (shrug)",
        name: "Hardys",
      },
    },
    {
      coordinates: [-6.258063, 53.347958],
      properties: {
        review:
          "A regular of the Mammy. Not a bad bar. A load of shite on the walls for decoration and staff are generally friendly but they refused Kev after an Ireland match, so fuck ye. fuck ye in ur fuckin nancy pancy little arses.",
        name: "Lanigans",
      },
    },
    {
      coordinates: [-6.446417, 53.279509],
      properties: {
        review:
          "Very friendly staff but smacks off a hotel. Drinks are too expensive and layout is too fancy. A big meh...",
        name: "The Maple Tree",
      },
    },
    {
      coordinates: [-6.233533, 53.245715],
      properties: {
        review:
          "Stunning views over Dublin from the many outdoor tables. Seems a good atmosphere in the boozer as well. Liked this place a lot. Although the roads on the way to it are fuckin tiny. Oh and they even had Nobbys Nuts. So extra bonus points.",
        name: "The Blue Light",
      },
    },
    {
      coordinates: [-6.15104, 53.485187],
      properties: {
        review:
          "Oscar the barman has the best cross Chinese/Dub accent I've ever heard. Also Joe O'Shea wired the place and said they never paid him for it but fuck it at least the pint was nice",
        name: "Smyths",
      },
    },
    {
      coordinates: [-6.240209, 53.264647],
      properties: {
        review:
          "I'd say the last time this place was done up was sometime in the 70's. Went with the kids to check out The Exploratorium beside it which just left me confused and scared. Food is shite. Bar is pretty good apart from that though. Friendly relaxed feel to the place. Very remote, so prob won't be back.",
        name: "Lamb Doyles",
      },
    },
    {
      coordinates: [-6.167217, 53.388288],
      properties: {
        review:
          "Larger than you'd think from the outside. Nice local boozer. There was a one eyed dog asleep on the floor when we got in. Guiness wasn't the best but there was a lad actually working on the taps so that's my bad for going for a fuckin Guinness... ",
        name: "Madigans",
      },
    },
    {
      coordinates: [-6.15548, 53.385984],
      properties: {
        review:
          "Like walking down a players tunnel to get into it. Big pub but the Sky box was busted so no racing on... Ended up having to talk to Kev... Ughhhh",
        name: "The Foxhound Inn",
      },
    },
    {
      coordinates: [-6.164922, 53.381192],
      properties: {
        review:
          "Good boozer. Friendly locals. They had the Dublin v Kerry game on repeat in the bar...",
        name: "Cedar Lounge",
      },
    },
    {
      coordinates: [-6.174249, 53.37999],
      properties: {
        review:
          "Pool hall upstairs if you're bored. Local feel to the place.... Scampi fries... they did have scampi fries... I do likes me scampi fries",
        name: "Raheny Inn",
      },
    },
    {
      coordinates: [-6.174902, 53.380493],
      properties: {
        review:
          "Ginger Beer and some fuckin bitters addin thing... I dunno what the fuck Kev was drinking tbh. The place is modern and hipstery. Hog heads on the wall and animal hair backed bar stools... Although I'm sure the animal hair is fake. I can't imagine the hipsters would be for killing the poor animals and all that. A bit foody and full of auld ones but sure fuck it.. A pints a pint",
        name: "The Manhattan Beer Co",
      },
    },
    {
      coordinates: [-6.177264, 53.379881],
      properties: {
        review:
          "Yeah good pub. Discout for OAPs which was kinda cool. Although I'm not an OAP. Good barman, good crowd in... decent boozer",
        name: "The Watermill",
      },
    },
    {
      coordinates: [-6.193521, 53.378408],
      properties: {
        review:
          "Kev gave me some very solid advice here to not laugh at people when their horse comes last... He's a very wise zen master indeed.",
        name: "Horse and Hound",
      },
    },
    {
      coordinates: [-6.257905, 53.349079],
      properties: {
        review:
          "Chipboard walls. 3 staff on to cater for the 6 people in the bar. More gin than ya cud shake a fist at... All a bit hipstery.. Not bad though",
        name: "Pipers Corner",
      },
    },
    {
      coordinates: [-6.259016, 53.348929],
      properties: {
        review:
          "Small but good. Warm feel to the place. Barman was good and chatty. And there was a lad in swapping door handles for pints... Love that...",
        name: "Sackville Louge",
      },
    },
    {
      coordinates: [-6.258027, 53.349503],
      properties: {
        review:
          "Normal down to earth bar. Nothing special. Barman on was handling the place well. Signed McManamon montage on the wall look kinda cool. More pissers than the DunLeary/Rathdown head office...",
        name: "Briodys",
      },
    },
    {
      coordinates: [-6.258838, 53.348624],
      properties: {
        review:
          "Ok pub. Seemed a bit touristy. This is where things start to go south though. Sure who wants to go see fuckin Bulgaria anyways...",
        name: "Madigans",
      },
    },
    {
      coordinates: [-6.259181, 53.348318],
      properties: {
        review:
          "Ughhh... Wasn't mad about it. Bit too nice... or whatever. They had lights on the table that when turned upside down electrocuted the heroin addicted barstaff though. So that was kinda fun to play with",
        name: "Grand Central",
      },
    },
    {
      coordinates: [-6.259351, 53.350227],
      properties: {
        review:
          "Once Kev wanted a breakfast from Annes... But Annes wasnt open... So he went in here and had a pint instead... Oh the hilarity of it all... Laugh Laugh Laugh.... Seriously though... Shite!",
        name: "Madigans",
      },
    },
    {
      coordinates: [-6.259787, 53.350458],
      properties: {
        review:
          "Zap wasn't in which was a bit dissapointing but apart from that tis a standard city centre pub. A load of food orders going out which is meh.. but pints and service was generally good...",
        name: "Brannigans",
      },
    },
    {
      coordinates: [-6.256529, 53.349043],
      properties: {
        review:
          "A weatherspoons pub. Was hooping when we were there and food and drink are piss cheap. It's hard not to like these places... :shrug:",
        name: "The Silver Penny",
      },
    },
    {
      coordinates: [-6.500937, 53.299756],
      properties: {
        review:
          "Recently done up so was looking very well. Very large food area out the back but still a well seperated bar at the front. Bar is small enough but had a good atmosphere with a few people in for the match. Seems to be a small bar only area out in the lounge as well which might suit people also. Good parking available here too... Good shout for a Sunday lunch out with the kids or whatever... Kev said the bargirls in the lounge were cracking as well although I was only served by Eamonn... so...",
        name: "The Gondola",
      },
    },
    {
      coordinates: [-6.486088, 53.362474],
      properties: {
        review:
          "Was our first post Covid world pub. To be honest we didn't even know the place was in Dublin until someone highlighted the stupidity of the localized lockdowns being placed along county lines... Cool pub though. They put the effort in to make social distancing possible. Ya can rent a horse box to have ur 9 euro meal and few scoops, which sounds a lot worse than it actually is. After nearly 5 months without a pint in the pub, the Guinness here was possibly the best Guinness I've ever had. Fuckin loved it. Kev only had the one though. He was driving. Aghgghhhahahagahagahagahagahhahahahhahaahhahhahhahahahahaahahaha...",
        name: "The Salmon Leap",
      },
    },
    {
      coordinates: [-6.188535, 53.587506],
      properties: {
        review:
          "These are strange covid times we're livinig in. So hard to rate a place. First pub we've been to in a year.... Staff were bang on anyways. Only had the one here so not much to say. Layout is grand. Wayyyyy out for us. Only reason we made it here was by bringing the kids out to Ardgillan castle for a trip. Defo not the worst though. ",
        name: "The Balrothery Inn",
      },
    },
    {
      coordinates: [-6.385769, 53.362317],
      properties: {
        review:
          "Impressive outdoor setup. Lots of parking space which is handy as the place is a bit out of the way. Savage views of the underside of the M50 are unique I guess.",
        name: "The Strawberry Hall",
      },
    },
    {
      coordinates: [-6.401808, 53.362486],
      properties: {
        review:
          "Beautiful looking bar. Will definitely be back as we had to drink outside due to covid. Quiet bar, good vibes and they did a savage little blueberry cocktail for Kev.",
        name: "The Wrens Nest",
      },
    },
    {
      coordinates: [-6.255036, 53.350611],
      properties: {
        review:
          "Gary, the barman, does not give a fuck what you do. Nice pub, good decor, very music oriented. Good mix of tourists and locals as well.",
        name: "The Celt",
      },
    },
    {
      coordinates: [-6.261513, 53.346311],
      properties: {
        review:
          "Friendly barman, a little bit hipstery. Lots of deals on shots and stuff like that. Great location but prob geared for a younger crowd than me",
        name: "Riot",
      },
    },
    {
      coordinates: [-6.265803, 53.344608],
      properties: {
        review:
          "Looks like a hotel bar. Loads of boats hanging out of the ceiling for some reason. Was pretty good though. Kev flip-flopped on the place a bit but the cycling motif in the jacks really upper the tierage.",
        name: "The Wild Duck",
      },
    },
    {
      coordinates: [-6.258935, 53.343032],
      properties: {
        review:
          "Bargirl definitely had a thing for me here. In another life it could've been magical. What can I say, the place is a purveryor of porters and lots of other stuff. Great selection but steep prices",
        name: "The Portehouse",
      },
    },
    {
      coordinates: [-6.230806, 53.344626],
      properties: {
        review:
          "What a pile of wank this place is. I don't know if it's the fuckin 7.50 pints or the stupid beards and hats. Feels anything like a pub. The beer was watery and shite or else made from the anal drippings of a rare albino tree ferret.... ya know.... just to be cool.... fuckin waste of space.",
        name: "BrewDog",
      },
    },
    {
      coordinates: [-6.227644, 53.341727],
      properties: {
        review:
          "Decent selection of beers on tap. Great base for a pre lansdowne drink. A little bit on the pricey side but sure blame the fuckin tax on that. Also tried Islands Edge for the first time here, It won't be replacing me Guinness. No salt & vinegar though. WTF is that about?",
        name: "John Clarke & Sons",
      },
    },
    {
      coordinates: [-6.272034, 53.369644],
      properties: {
        review:
          "Have to admit I was a little bit overawed in here. Massive reputation. Of course went with the Guinness and Coddle. Bang on. No complaints. Outside of that, they have a savage little menu. Really want to try the bacon and cabbage spring roll.... If you're reading this, and yer not me, just fuckin go here and do a tour of the Glasnevin cementary and then sink a few Guinness and have some coddle and batch. Fuckin perfect things dont happen often.",
        name: "Gravediggers",
      },
    },
    {
      coordinates: [-6.272124, 53.365231],
      properties: {
        review:
          "Apart from the savage name it's not a bad little boozer. Not cheap but fuckin where is these days. No complaints. Even if itis in the heart of Boez Scum land.",
        name: "The Brian Boru",
      },
    },
    {
      coordinates: [-6.271447, 53.36468],
      properties: {
        review:
          "Ok let's be honest for a sec. I'm too old for shiholes like this. It's not the beanie hats. It's not the fact that the bar staff are fuckin young enough to play with me kids. It's not even the stupid fuckin disco ball swirling around the bar at fuckin 2 o'clock on a Wednesday. It's just... not a fuckin bar. Let it off to the young wans. Fuck it. I'll resign meself as an unknowing dinosaur in this sense.",
        name: "The Berndar Shaw (Part Deux)",
      },
    },
    {
      coordinates: [-6.393518, 53.32129],
      properties: {
        review:
          "Massive pub. was in with the kids for a bit of a lunch. Scampi was bang on. Guinness was nice and slurpy. Hard to rate a place when it's midday but nothing to object about anyways.",
        name: "Quinlans - The Black Lion",
      },
    },
    {
      coordinates: [-6.324064, 53.336108],
      properties: {
        review:
          "Doesn't really feel like a pub and they've no fuckin crisps but I won't hear a bad word said about the place. They support Pat so I support them with my drunken endeavours. Also the pizza looked nice.",
        name: "Rascals",
      },
    },
    {
      coordinates: [-6.32656, 53.32407],
      properties: {
        review: "Owned by a scumbag. And they don't have crisps. ",
        name: "The Black Forge Inn",
      },
    },
    {
      coordinates: [-6.32553, 53.3242],
      properties: {
        review:
          "Auld farts feel to the place. I like it. For some reason they didn't seem to want me to pay. Kev said mention that they had very small bags of nuts. But they didnt charge for them anyways, so can't gripe.",
        name: "Eleanoras",
      },
    },
    {
      coordinates: [-6.32846, 53.32388],
      properties: {
        review:
          "Massive place. Modern gastropub feel to the place. Watched the first half of Ireland v Portugal here. Why not at the match you ask? Because every muppet in the country wanted to lick the sweat off Ronaldos balls. Fuck em. Let them at it. I was happy enough drinking instead",
        name: "The Halfway House",
      },
    },
    {
      coordinates: [-6.30332, 53.32868],
      properties: {
        review:
          "Was well oiled by the time I got here so can't remember too much about it. Kev recognised the barman from The Black Lion. Also he was very adamant that the wrong drink was just a mistake. Grand boozer. No complaints.",
        name: "The gate Bar",
      },
    },
    {
      coordinates: [-6.24823, 53.3492],
      properties: {
        review:
          "Meh. Nice selection of beers and downstairs looks kinda cool but it doesn't really feel like a pub. Nothing bad about it but just not my style.",
        name: "Urban Brewing",
      },
    },
    {
      coordinates: [-6.2587, 53.34066],
      properties: {
        review:
          "Oh god. Do not like. Kev enjoyed the singing. fuck it... its done... i never have to go back",
        name: "Cafe Insane",
      },
    },
    {
      coordinates: [-6.2634, 53.34403],
      properties: {
        review:
          "Small bar but seemed popular. Nothing overly memorable about it but nothing wrong with it either",
        name: "Mulligan & Haines",
      },
    },
    {
      coordinates: [-6.26476, 53.34533],
      properties: {
        review:
          "Very touristy but the prices weren't ridiculously higher than other places. Maybe everywhere in Dublin is just a rip off anyways. If ya don't mind dodging coked up tourists then it's fine... I guess...",
        name: "The Norseman",
      },
    },
    {
      coordinates: [-6.196718, 53.239551],
      properties: {
        review:
          "Fairly standard housing estate type pub. A good few in for Sunday lunch. Lots of staff buzzing around. No complaints though. We were in after doing a little hike in the mountains there. Its a nice area.",
        name: "Farmer Browns",
      },
    },
    {
      coordinates: [-6.24568, 53.34646],
      properties: {
        review:
          "Pretentious overpriced kip. Fuckin 4.50 for nuts. Yis arent fuckin New Yrok. FUck off will ya.",
        name: "Dockers",
      },
    },
    {
      coordinates: [-6.23814, 53.34438],
      properties: {
        review:
          "Another fuckin Weatherspoons. I really want to hate these places so much. Soul-less. But fuck me they do some perfectly priced drink. Stopped in on the way to a match in Lansdowne and the previous pub, the round was 14, this place the round is 8. Like how can ya argue with that. Even if it is an assembly line hammer blow to real locals... conflicted...",
        name: "The South Strand",
      },
    },
    {
      coordinates: [-6.27543, 53.33236],
      properties: {
        review:
          "Good chat at the bar. Barman was from Mayo and a punter was a closet Combat 18 fan so plenty of sporty banter. Place looks more like a restaurant than a pub but they have Ambush on tap (which is fuckin heavenly) and good chat == happy punters",
        name: "57 The Headline",
      },
    },
    {
      coordinates: [-6.27541, 53.33217],
      properties: {
        review:
          "Looks like a good local bar. Was quiet when we were there. Cheaper than its neighbour but nothing massively standoutish about it.",
        name: "Leonards Corner",
      },
    },
    {
      coordinates: [-6.27563, 53.33041],
      properties: {
        review:
          "Same owner/operator as Square Ball and very much the same vibe. Barman was a god yap though. He's the first lad to actually ask for a link to the review site, so hello if yer reading. In terms of the place, its a bit pricey and the furniture is a bit poncey. I'm sure we're not their target audience but a decent drink selection on tap, so no complaints.",
        name: "MVP",
      },
    },
    {
      coordinates: [-6.27523, 53.33002],
      properties: {
        review:
          "Old bar feel to the place. Football was on the TV. No fuckin salt and vinegar though. WTF. Plenty of Dubs licence plates on the wall so say it'd be a good shout for watching a match.",
        name: "Harold House",
      },
    },
    {
      coordinates: [-6.12375, 53.38934],
      properties: {
        review:
          "Nice bar. Plenty of room. Most importantly though it was open by half 11 on a bank holiday Monday unlike all the kips in Howth... :D",
        name: "The Elphin Bar",
      },
    },
    {
      coordinates: [-6.25212, 53.34481],
      properties: {
        review:
          "Some expensive-ass whiskey in the place but has a nice feel to it. Little snug in the corner as well. Owner apparently has another place out in Donabate but it wasn't Oscars place...",
        name: "Moss Lane",
      },
    },
    {
      coordinates: [-6.27336, 53.34331],
      properties: {
        review:
          "Standard enough Galway brewhouse type deal. Beers on a chalk board. Lots of wooly hats for no discernable reason. The window at the front of the bar is a savage little view out on the world though. Nice to sink a pint and stare at randos walking by",
        name: "The Beer Market",
      },
    },
    {
      coordinates: [-6.27925, 53.34292],
      properties: {
        review:
          "Real local bar but the owner is a Pats fan so immediately in the good books. Scarf up behind the bar. Schlurpy pints. No complaints",
        name: "The Clock",
      },
    },
    {
      coordinates: [-6.27896, 53.3427],
      properties: {
        review:
          "Ambush on tap. Fuck yeah. Bargirl confused Kev though... Another great cross Brazilian/Dublin accent",
        name: "Dudleys",
      },
    },
    {
      coordinates: [-6.27756, 53.34269],
      properties: {
        review:
          "We were all set to hate this place. Made up to look like an old shop and then suddenly morphs into a fuckin American diner in the middle and then the jacks at the back. Seems to be putting a lot of effort in to look like something but it wasnt too bad tbh. Good crowd in for pre-gig drinks so the atmosphere was alright",
        name: "Johns Bar & Haerdashery",
      },
    },
    {
      coordinates: [-6.27725, 53.34274],
      properties: {
        review:
          "Standard enough place. Some world class Darts lads warming up. Or maybe they were shit. Da Fuck do I know about Darts. Another one that gets a bit of atmosphere from pre gig crowds so there's an interesting mix in the place",
        name: "Tom Kennedys",
      },
    },
    {
      coordinates: [-6.33204, 53.37585],
      properties: {
        review:
          "Nice location alongside the canal. Nice food and reasonably priced. ",
        name: "The Lock Keeper",
      },
    },
    {
      coordinates: [-6.25858, 53.34785],
      properties: {
        review:
          "Tis a magical wonderous place where bartenders use some kind of vulcan mind meld power to guess what crisps you secretly desire most and your first round is always free. We were even joined by two Mexican lads Francisco and Alvaro. Unfortunately they forgot to bring the Tortillas... much sadness...",
        name: "Meaghers",
      },
    },
    {
      coordinates: [-6.25788, 53.34581],
      properties: {
        review:
          "So lets be clear from the get go. It may be owned by the same owner as a certain kip hole cunt place.... BUT ITS A DIFFERENT BAR. Dodgey gray area sure. Bar is nice though. Francis joined us for a pint but he was a little bit scared of all the old women wandering around stealing glasses. Still... Pints were schlurpy",
        name: "Bowes",
      },
    },
  ],
};

function initMap() {
  map = new window.woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 53.3485, lng: -6.257 },
      zoom: 16,
    },
  );

  pubsData.pubs.forEach((pub) => {
    map.data.add({
      geometry: new window.woosmap.map.Data.Point({
        lat: pub.coordinates[1],
        lng: pub.coordinates[0],
      }),
      properties: { name: pub.properties.name },
    });
  });

  map.data.setStyle((feature) => {
    let iconPint =
      "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzRweCIgaGVpZ2h0PSIzNHB4IiB2aWV3Qm94PSIwIDAgMzQgMzQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+T3ZhbDwvdGl0bGU+CiAgICA8ZGVmcz4KICAgICAgICA8Y2lyY2xlIGlkPSJwYXRoLTEiIGN4PSIxNyIgY3k9IjE1IiByPSIxMyI+PC9jaXJjbGU+CiAgICAgICAgPGZpbHRlciB4PSItMjYuOSUiIHk9Ii0xOS4yJSIgd2lkdGg9IjE1My44JSIgaGVpZ2h0PSIxNTMuOCUiIGZpbHRlclVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgaWQ9ImZpbHRlci0yIj4KICAgICAgICAgICAgPGZlT2Zmc2V0IGR4PSIwIiBkeT0iMiIgaW49IlNvdXJjZUFscGhhIiByZXN1bHQ9InNoYWRvd09mZnNldE91dGVyMSI+PC9mZU9mZnNldD4KICAgICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMiIgaW49InNoYWRvd09mZnNldE91dGVyMSIgcmVzdWx0PSJzaGFkb3dCbHVyT3V0ZXIxIj48L2ZlR2F1c3NpYW5CbHVyPgogICAgICAgICAgICA8ZmVDb21wb3NpdGUgaW49InNoYWRvd0JsdXJPdXRlcjEiIGluMj0iU291cmNlQWxwaGEiIG9wZXJhdG9yPSJvdXQiIHJlc3VsdD0ic2hhZG93Qmx1ck91dGVyMSI+PC9mZUNvbXBvc2l0ZT4KICAgICAgICAgICAgPGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuNSAwIiB0eXBlPSJtYXRyaXgiIGluPSJzaGFkb3dCbHVyT3V0ZXIxIj48L2ZlQ29sb3JNYXRyaXg+CiAgICAgICAgPC9maWx0ZXI+CiAgICA8L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iT3ZhbCI+CiAgICAgICAgICAgIDx1c2UgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMSIgZmlsdGVyPSJ1cmwoI2ZpbHRlci0yKSIgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgICAgIDxjaXJjbGUgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lam9pbj0ic3F1YXJlIiBmaWxsPSIjRTJCOTY3IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGN4PSIxNyIgY3k9IjE1IiByPSIxMS41Ij48L2NpcmNsZT4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==";
    if (feature.getProperty("highlighted")) {
      iconPint =
        "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzRweCIgaGVpZ2h0PSIzNHB4IiB2aWV3Qm94PSIwIDAgMzQgMzQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+T3ZhbDwvdGl0bGU+CiAgICA8ZGVmcz4KICAgICAgICA8Y2lyY2xlIGlkPSJwYXRoLTEiIGN4PSIxNyIgY3k9IjE1IiByPSIxMyI+PC9jaXJjbGU+CiAgICAgICAgPGZpbHRlciB4PSItMjYuOSUiIHk9Ii0xOS4yJSIgd2lkdGg9IjE1My44JSIgaGVpZ2h0PSIxNTMuOCUiIGZpbHRlclVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgaWQ9ImZpbHRlci0yIj4KICAgICAgICAgICAgPGZlT2Zmc2V0IGR4PSIwIiBkeT0iMiIgaW49IlNvdXJjZUFscGhhIiByZXN1bHQ9InNoYWRvd09mZnNldE91dGVyMSI+PC9mZU9mZnNldD4KICAgICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMiIgaW49InNoYWRvd09mZnNldE91dGVyMSIgcmVzdWx0PSJzaGFkb3dCbHVyT3V0ZXIxIj48L2ZlR2F1c3NpYW5CbHVyPgogICAgICAgICAgICA8ZmVDb21wb3NpdGUgaW49InNoYWRvd0JsdXJPdXRlcjEiIGluMj0iU291cmNlQWxwaGEiIG9wZXJhdG9yPSJvdXQiIHJlc3VsdD0ic2hhZG93Qmx1ck91dGVyMSI+PC9mZUNvbXBvc2l0ZT4KICAgICAgICAgICAgPGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuNSAwIiB0eXBlPSJtYXRyaXgiIGluPSJzaGFkb3dCbHVyT3V0ZXIxIj48L2ZlQ29sb3JNYXRyaXg+CiAgICAgICAgPC9maWx0ZXI+CiAgICA8L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iT3ZhbCI+CiAgICAgICAgICAgIDx1c2UgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMSIgZmlsdGVyPSJ1cmwoI2ZpbHRlci0yKSIgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgICAgIDxjaXJjbGUgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lam9pbj0ic3F1YXJlIiBmaWxsPSIjNjI2MjYyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGN4PSIxNyIgY3k9IjE1IiByPSIxMS41Ij48L2NpcmNsZT4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==";
    }
    return {
      icon: iconPint,
    };
  });

  let highlightedFeatureId;
  map.data.addListener("click", (event) => {
    if (highlightedFeatureId) {
      const highlightedFeature = map.data.getFeatureById(highlightedFeatureId);
      if (highlightedFeature) {
        highlightedFeature.setProperty("highlighted", false);
      }
    }
    const infoElement = document.getElementById("info");
    if (infoElement) {
      infoElement.innerHTML = `<strong>${event.feature.getProperty(
        "name",
      )}</strong>`;
    }
    event.feature.setProperty("highlighted", true);
    highlightedFeatureId = event.feature.id;
  });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;

export {};
