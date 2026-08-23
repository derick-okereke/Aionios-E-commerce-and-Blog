/* =============================================================
   books.js — Book data store
   Single source of truth for every book on the site.

   Used by:
     - book-detail.js  (dynamic page population + purchase modal)
     - book-filter.js  (reads data-category from HTML, no direct use)

   To add a new book:
     1. Copy one of the objects below.
     2. Give it a unique slug (lowercase, hyphens only).
     3. Add the slug to the `related` arrays of relevant books.
     4. Add a matching <a> card to books.html.
     5. Make sure book-detail.html?slug=YOUR-SLUG works.

   Cover images: place them in the images/ folder and set `cover`
   to the relative path. If no image exists yet, set cover to null
   and provide coverPlaceholderBg + coverPlaceholderColor instead.
   ============================================================= */

// ── Book catalogue ────────────────────────────────────────────
const BOOKS = [

  // ── ADULT BOOKS ──────────────────────────────────────────

  {
    slug:               'in-him-realities',
    title:              'In Him Realities',
    author:             'Aionios Life',
    genre:              'adult',
    genreLabel:         'Adult · Christian',
    price:              '₦3,500',
    priceRaw:           3500,
    cover:              'images/in him realities.jpeg',
    coverAlt:           'Book cover: In Him — Realities',
    coverPlaceholderBg: null,
    coverPlaceholderColor: null,
    description: [
      'In Him Reality unveils the believer\'s co-inclusion with Christ, revealing the shared life and inseparable union established through His death, burial, resurrection, and exaltation.',
      'It opens your eyes to what it truly means to be in Christ, helping you understand your identity, inheritance, and every redemptive blessing that is yours because of your union with Him.'
    ],
    excerpt: [
      '"Before you could do anything — before you could pray enough, believe enough, or behave enough — God made you complete in Him. This is not a destination you are travelling toward. It is a reality you woke up inside of, the moment you said yes to Jesus."',
      '"Your identity is not built on your performance. It is anchored in His resurrection. You are not trying to become righteous. You are righteous — and learning to live from that truth."'
    ],
    selarUrl: 'https://selar.co/REPLACE-IN-HIM-REALITIES',
    related:  ['redemption-realities', 'spiritual-warfare', 'exposing-sin']
  },

  {
    slug:               'redemption-realities',
    title:              'Redemption Realities',
    author:             'Aionios Life',
    genre:              'adult',
    genreLabel:         'Adult · Christian',
    price:              '₦3,200',
    priceRaw:           3200,
    cover:              'images/redemption realities.jpeg',
    coverAlt:           'Book cover: Redemption Realities',
    coverPlaceholderBg: null,
    coverPlaceholderColor: null,
    description: [
      'Our Redemption Reality unveils the riches of the believer\'s redemption in Christ. It opens your eyes to the realities that became yours the moment you believed the gospel, revealing who you are in Christ, what you have in Him, and the full benefits of your redemption.',
      'This book is designed to establish you in your identity, inheritance, and confidence as a child of God.'
    ],
    excerpt: [
      '"The blood of Jesus did not buy you a second chance. It bought you a new life. There is a difference — and the difference changes everything about how you approach God, how you see yourself, and how you face the challenges of each day."',
      '"You do not fight for victory. You fight from victory. The resurrection settled the matter. Your role is to believe what heaven has already declared."'
    ],
    selarUrl: 'https://selar.co/REPLACE-REDEMPTION-REALITIES',
    related:  ['in-him-realities', 'spiritual-warfare', 'christ-our-substitute']
  },

  {
    slug:               'spiritual-warfare',
    title:              'Spiritual Warfare',
    author:             'Aionios Life',
    genre:              'adult',
    genreLabel:         'Adult · Christian',
    price:              '₦3,500',
    priceRaw:           3500,
    cover:              'images/Spiritual warfare.jpeg',
    coverAlt:           'Book cover: Spiritual Warfare',
    coverPlaceholderBg: null,
    coverPlaceholderColor: null,
    description: [
      'Spiritual Warfare challenges many of the misconceptions surrounding spiritual warfare by examining it through the finished work of Christ. This book reveals what spiritual warfare truly means in light of redemption, helping believers understand their authority in Christ and equipping them to live from victory rather than fight for it.',
      'A practical and scripturally grounded guide for every believer seeking clarity, confidence, and spiritual effectiveness.'
    ],
    excerpt: [
      '"The enemy is not more powerful than your Lord. He never was. His greatest weapon is deception — making you believe you are weaker than you are, or that God is further away than He is. The moment you see through the lie, the battle shifts."',
      '"Put on the whole armour of God. Not because you are afraid, but because you are clothed in victory — and you want the world, and the enemy, to know it."'
    ],
    selarUrl: 'https://selar.co/REPLACE-SPIRITUAL-WARFARE',
    related:  ['in-him-realities', 'redemption-realities', 'most-excellent-name']
  },


  {
    slug:               'ainos-soteria',
    title:              'Ainos Soteria',
    author:             'Oku Andy',
    genre:              'adult',
    genreLabel:         'Adult · Christian',
    price:              '₦3,000',
    priceRaw:           3000,
    cover:              'images/Ainos soteria.jpeg',
    coverAlt:           'Book cover: Ainos Soteria',
    coverPlaceholderBg: null,
    coverPlaceholderColor: null,
    description: [
      'Aionios Soteria explores the biblical meaning of eternal salvation through the person and finished work of Jesus Christ.',
      'Discover the depth, certainty, and everlasting nature of the salvation God freely gives by grace through faith.'
    ],
    excerpt: [
      '"When you truly see what salvation means — what it cost, what it includes, what it guarantees — praise is no longer something you do. It becomes something you cannot help but do."'
    ],
    selarUrl: 'https://selar.co/REPLACE-AINOS-SOTERIA',
    related:  ['in-him-realities', 'redemption-realities', 'homologia']
  },

  {
    slug:               'christ-our-substitute',
    title:              'Christ Our Substitute',
    author:             'Oku Andy',
    genre:              'adult',
    genreLabel:         'Adult · Christian',
    price:              '₦3,000',
    priceRaw:           3000,
    cover:              'images/Christ our substitude.jpeg',
    coverAlt:           'Book cover: Christ Our Substitute',
    coverPlaceholderBg: null,
    coverPlaceholderColor: null,
    description: [
      'Christ Is Our Substitute reveals the heart of the gospel through Jesus\' substitutionary work on the cross.',
      'Discover how He took our place so we could share in His righteousness, life, and eternal inheritance.'
    ],
    excerpt: [
      '"Everything God required of you, Christ fulfilled on your behalf. Not partially — completely. The exchange at the cross was total: your sin for His righteousness, your death for His life."'
    ],
    selarUrl: 'https://selar.co/REPLACE-CHRIST-OUR-SUBSTITUTE',
    related:  ['redemption-realities', 'the-gospel-is-not-stop-sinning', 'in-him-realities']
  },

  {
    slug:               'free-yet-bound',
    title:              'Free Yet Bound',
    author:             'Oku Andy',
    genre:              'adult',
    genreLabel:         'Adult · Christian',
    price:              '₦3,000',
    priceRaw:           3000,
    cover:              'images/Free yet bound.jpeg',
    coverAlt:           'Book cover: Free Yet Bound',
    coverPlaceholderBg: null,
    coverPlaceholderColor: null,
    description: [
      'Free Yet Bound explores the tension between freedom and bondage through the lens of the gospel.',
      'Discover how true freedom is found in Christ and what it means to live free from sin, fear, and condemnation.'
    ],
    excerpt: [
      '"You are free from the law of sin and death. And you are bound — not by compulsion, but by love — to the One who set you free. This is not a contradiction. It is the very shape of grace."'
    ],
    selarUrl: 'https://selar.co/REPLACE-FREE-YET-BOUND',
    related:  ['in-him-realities', 'loving-god', 'intertwined']
  },

  {
    slug:               'gods-mind-towards-you',
    title:              "God's Mind Towards You",
    author:             'Oku Andy',
    genre:              'adult',
    genreLabel:         'Adult · Christian',
    price:              '₦2,800',
    priceRaw:           2800,
    cover:              "images/God's mind towards you.jpeg",
    coverAlt:           "Book cover: God's Mind Towards You",
    coverPlaceholderBg: null,
    coverPlaceholderColor: null,
    description: [
      "God's Mind Towards You: He Loves You reveals God's unchanging heart toward humanity through the lens of Christ.",
      "Discover that His thoughts toward you are not of condemnation but of love, grace, acceptance, and the finished work of Jesus."
    ],
    excerpt: [
      '"God is not watching you with disappointment. His thoughts toward you — according to His own Word — are thoughts of peace, not of evil. Of a future, and a hope."'
    ],
    selarUrl: "https://selar.co/REPLACE-GODS-MIND-TOWARDS-YOU",
    related:  ['in-him-realities', 'redemption-realities', 'loving-god']
  },

  {
    slug:               'homologia',
    title:              'Homologia',
    author:             'Oku Andy',
    genre:              'adult',
    genreLabel:         'Adult · Christian',
    price:              '₦2,800',
    priceRaw:           2800,
    cover:              'images/Homologia.jpeg',
    coverAlt:           'Book cover: Homologia',
    coverPlaceholderBg: null,
    coverPlaceholderColor: null,
    description: [
      'Homologia explores the biblical power of speaking in agreement with God\'s Word.',
      'Discover how a Christ-centered confession flows from faith, strengthens your walk, and reflects the realities of the finished work of Christ.'
    ],
    excerpt: [
      '"To confess is to say the same thing God says — about you, about your situation, about your future. It is the language of faith, agreeing with the One who cannot lie."'
    ],
    selarUrl: 'https://selar.co/REPLACE-HOMOLOGIA',
    related:  ['the-living-word', 'ainos-soteria', 'in-him-realities']
  },

  {
    slug:               'the-gospel-is-not-stop-sinning',
    title:              'The Gospel Is Not Stop Sinning',
    author:             'Oku Andy',
    genre:              'adult',
    genreLabel:         'Adult · Christian',
    price:              '₦3,000',
    priceRaw:           3000,
    cover:              'images/The gospel is not stop sinning.jpeg',
    coverAlt:           'Book cover: The Gospel Is Not Stop Sinning',
    coverPlaceholderBg: null,
    coverPlaceholderColor: null,
    description: [
      'The Gospel Is Not "Stop Sinning" uncovers the true message of the gospel as the good news of Christ\'s finished work.',
      'Discover how grace transforms lives from the inside out, producing genuine holiness through faith in Jesus.'
    ],
    excerpt: [
      '"The gospel is not a call to behaviour management. It is the announcement of what God has done in Christ — and the invitation to receive it."'
    ],
    selarUrl: 'https://selar.co/REPLACE-GOSPEL-NOT-STOP-SINNING',
    related:  ['christ-our-substitute', 'redemption-realities', 'free-yet-bound']
  },

  {
    slug:               'they-shall-never-perish',
    title:              'They Shall Never Perish',
    author:             'Oku Andy',
    genre:              'adult',
    genreLabel:         'Adult · Christian',
    price:              '₦2,800',
    priceRaw:           2800,
    cover:              'images/They shall never perish.jpeg',
    coverAlt:           'Book cover: They Shall Never Perish',
    coverPlaceholderBg: null,
    coverPlaceholderColor: null,
    description: [
      'They Shall Never Perish explores the believer\'s eternal security in Christ through the Scriptures.',
      'Discover the certainty of God\'s promise and the unshakable assurance found in the finished work of Jesus.'
    ],
    excerpt: [
      '"Jesus said, \"They shall never perish.\" Not \"as long as they keep their behaviour in order.\" Never. No qualifier. No escape clause."'
    ],
    selarUrl: 'https://selar.co/REPLACE-THEY-SHALL-NEVER-PERISH',
    related:  ['in-him-realities', 'redemption-realities', 'christ-our-substitute']
  },

  {
    slug:               'what-is-salvation',
    title:              'What Is Salvation?',
    author:             'Oku Andy',
    genre:              'adult',
    genreLabel:         'Adult · Christian',
    price:              '₦2,500',
    priceRaw:           2500,
    cover:              'images/What is salvation.jpeg',
    coverAlt:           'Book cover: What Is Salvation?',
    coverPlaceholderBg: null,
    coverPlaceholderColor: null,
    description: [
      'What Is Salvation? Simply Put explains the message of salvation in clear, biblical, and Christ-centered language.',
      'Discover what Jesus accomplished through His death and resurrection, and what it truly means to be saved by grace through faith.'
    ],
    excerpt: [
      '"Salvation is not a transaction you completed and moved past. It is the reality you now live inside of — permanently joined to the One who saves."'
    ],
    selarUrl: 'https://selar.co/REPLACE-WHAT-IS-SALVATION',
    related:  ['christ-our-substitute', 'they-shall-never-perish', 'redemption-realities']
  },

  {
    slug:               'exposing-sin',
    title:              'Exposing Sin',
    author:             'Oku Andy',
    genre:              'adult',
    genreLabel:         'Adult · Christian',
    price:              '₦2,800',
    priceRaw:           2800,
    cover:              'images/exposing sin.jpeg',
    coverAlt:           'Book cover: Exposing Sin',
    coverPlaceholderBg: null,
    coverPlaceholderColor: null,
    description: [
      'Exposing Sin: Missing the Christ challenges approaches that make sin the center of the message instead of Christ.',
      'Discover why the gospel exposes humanity\'s need only to reveal God\'s perfect solution in Jesus and His finished work.'
    ],
    excerpt: [
      '"To expose sin is not to terrify the believer — it is to show them what the cross has already defeated. You walk away from sin from a place of victory, not shame."'
    ],
    selarUrl: 'https://selar.co/REPLACE-EXPOSING-SIN',
    related:  ['the-gospel-is-not-stop-sinning', 'free-yet-bound', 'christ-our-substitute']
  },

  {
    slug:               'intertwined',
    title:              'Intertwined',
    author:             'Oku Andy',
    genre:              'adult',
    genreLabel:         'Adult · Christian',
    price:              '₦3,000',
    priceRaw:           3000,
    cover:              'images/intertwined.jpeg',
    coverAlt:           'Book cover: Intertwined',
    coverPlaceholderBg: null,
    coverPlaceholderColor: null,
    description: [
      'A Christ-centered journey through the Bible, revealing how every covenant, prophecy, shadow, and promise is woven together in Jesus Christ. Discover the unity of Scripture and God\'s eternal purpose from Genesis to Revelation.'
    ],
    excerpt: [
      '"You are not near Christ. You are not beside Christ. You are in Christ — and He is in you. The language of the New Testament is not proximity. It is union."'
    ],
    selarUrl: 'https://selar.co/REPLACE-INTERTWINED',
    related:  ['in-him-realities', 'free-yet-bound', 'ainos-soteria']
  },

  {
    slug:               'loving-god',
    title:              'Loving God',
    author:             'Oku Andy',
    genre:              'adult',
    genreLabel:         'Adult · Christian',
    price:              '₦2,800',
    priceRaw:           2800,
    cover:              'images/loving God.jpeg',
    coverAlt:           'Book cover: Loving God',
    coverPlaceholderBg: null,
    coverPlaceholderColor: null,
    description: [
      'For centuries, many have imagined God as an angry Judge waiting to punish sinners. But is that the picture the Scriptures truly paint?',
      'In Sinners in the Hands of a Loving God, Oku Andy takes readers on a careful journey through the Bible to discover the God fully revealed in Jesus Christ. Rather than presenting a God whose primary posture is wrath, this book unveils the astonishing depth of divine love, mercy, and grace demonstrated at the cross.'
    ],
    excerpt: [
      '"When you understand how completely He loves you, love stops being a command you strain to keep, and becomes the natural response of a heart that has truly seen grace."'
    ],
    selarUrl: 'https://selar.co/REPLACE-LOVING-GOD',
    related:  ['gods-mind-towards-you', 'free-yet-bound', 'walking-in-the-spirit']
  },

  {
    slug:               'most-excellent-name',
    title:              'Most Excellent Name',
    author:             'Oku Andy',
    genre:              'adult',
    genreLabel:         'Adult · Christian',
    price:              '₦2,800',
    priceRaw:           2800,
    cover:              'images/most excellent name.jpeg',
    coverAlt:           'Book cover: Most Excellent Name',
    coverPlaceholderBg: null,
    coverPlaceholderColor: null,
    description: [
      'The Most Excellent Name unveils the supremacy and authority of the name of Jesus. ',
      'Discover why His name is above every name and what it means for the believer\'s identity, faith, and victory.'
    ],
    excerpt: [
      '"When you use the name of Jesus, you are speaking on behalf of Someone who has all authority in heaven and on earth — and who has authorised you to use His name."'
    ],
    selarUrl: 'https://selar.co/REPLACE-MOST-EXCELLENT-NAME',
    related:  ['homologia', 'spiritual-warfare', 'in-him-realities']
  },

  {
    slug:               'open-my-eye',
    title:              'Open My Eye',
    author:             'Oku Andy',
    genre:              'adult',
    genreLabel:         'Adult · Christian',
    price:              '₦2,800',
    priceRaw:           2800,
    cover:              'images/open my eye.jpeg',
    coverAlt:           'Book cover: Open My Eye',
    coverPlaceholderBg: null,
    coverPlaceholderColor: null,
    description: [
      'Oh Sweet Redemption is a Christ-centered journey into the beauty of God\'s redemptive plan revealed in Jesus.',
      'Discover the riches of the finished work of Christ and see the Scriptures through the lens of redemption.'
    ],
    excerpt: [
      '"The problem is not that God is hiding. The problem is that our eyes are dim. And the solution is the spirit of wisdom and revelation, opening what only He can open."'
    ],
    selarUrl: 'https://selar.co/REPLACE-OPEN-MY-EYE',
    related:  ['the-living-word', 'homologia', 'gods-mind-towards-you']
  },

  {
    slug:               'read-the-bible-right',
    title:              'Read the Bible Right',
    author:             'Oku Andy',
    genre:              'adult',
    genreLabel:         'Adult · Christian',
    price:              '₦3,000',
    priceRaw:           3000,
    cover:              'images/read the bible right.jpeg',
    coverAlt:           'Book cover: Read the Bible Right',
    coverPlaceholderBg: null,
    coverPlaceholderColor: null,
    description: [
      'Learn to interpret the Scriptures through the lens of Christ and the apostles. This practical guide equips you with sound biblical principles to rightly divide God\'s Word, avoiding speculation while uncovering the beauty of God\'s redemptive story.'
    ],
    excerpt: [
      '"Every page of the Bible points somewhere. The Old Testament points forward to Christ. The Epistles explain Him. When you see that, the whole Bible becomes a love letter."'
    ],
    selarUrl: 'https://selar.co/REPLACE-READ-THE-BIBLE-RIGHT',
    related:  ['the-living-word', 'open-my-eye', 'homologia']
  },

  {
    slug:               'the-god-life',
    title:              'The God Life',
    author:             'Oku Andy',
    genre:              'adult',
    genreLabel:         'Adult · Christian',
    price:              '₦3,000',
    priceRaw:           3000,
    cover:              'images/the God life.jpeg',
    coverAlt:           'Book cover: The God Life',
    coverPlaceholderBg: null,
    coverPlaceholderColor: null,
    description: [
      'GodLife unveils the divine life every believer receives in Christ.',
      'Discover what it means to live from the reality of God\'s life within you and walk daily in the fullness of His grace.'
    ],
    excerpt: [
      '"The life in you is not human life elevated to a higher level. It is God\'s own life — eternal, undefeatable, and overflowing. You are not living for God. You are living from God."'
    ],
    selarUrl: 'https://selar.co/REPLACE-THE-GOD-LIFE',
    related:  ['in-him-realities', 'intertwined', 'sonship-realities']
  },

  {
    slug:               'abbas-invitation',
    title:              "Abba's Invitation",
    author:             'Oku Andy',
    genre:              'adult',
    genreLabel:         'Adult · Christian',
    price:              '₦2,800',
    priceRaw:           2800,
    cover:              "images/Abba's invitation.jpeg",
    coverAlt:           "Book cover: Abba's Invitation",
    coverPlaceholderBg: null,
    coverPlaceholderColor: null,
    description: [
      "A journey into the heart of the Father, revealing His unconditional love, acceptance, and invitation to live deeply conscious of your sonship.",
    ],
    excerpt: [
      '"You were not adopted out of pity. You were received as a son — fully, permanently, and with all the rights and privileges of sonship. Abba is not merely a title. It is an identity."'
    ],
    selarUrl: "https://selar.co/REPLACE-ABBAS-INVITATION",
    related:  ['sonship-realities', 'in-him-realities', 'gods-mind-towards-you']
  },

  {
    slug:               'adelphos',
    title:              'ADELPHOS — We Are Brothers in Christ',
    author:             'Oku Andy',
    genre:              'adult',
    genreLabel:         'Adult · Christian',
    price:              '₦2,800',
    priceRaw:           2800,
    cover:              'images/adelphos.jpeg',
    coverAlt:           'Book cover: Adelphos',
    coverPlaceholderBg: null,
    coverPlaceholderColor: null,
    description: [
      'A revelation of our shared identity and family in Christ. ADELPHOS calls us beyond division into the reality that, in Christ, we are one family, joined by the same Father and the same life.',
    ],
    excerpt: [
      '"There is no Jew or Greek, no slave or free — not because differences do not exist, but because something greater does: the shared life of the Son of God, flowing through every believer equally."'
    ],
    selarUrl: 'https://selar.co/REPLACE-ADELPHOS',
    related:  ['in-him-realities', 'free-yet-bound', 'intertwined']
  },

  {
    slug:               'mind-of-christ',
    title:              'Ye Have the Mind of Christ',
    author:             'Oku Andy',
    genre:              'adult',
    genreLabel:         'Adult · Christian',
    price:              '₦3,000',
    priceRaw:           3000,
    cover:              'images/mind of christ.jpeg',
    coverAlt:           'Book cover: Ye Have the Mind of Christ',
    coverPlaceholderBg: null,
    coverPlaceholderColor: null,
    description: [
      "A revelation of the believer's divine inheritance — the mind of Christ. Discover how to think, perceive, and live from the reality of who you are in Him.",
    ],
    excerpt: [
      '"You do not need to borrow His thoughts — you have His mind. The question is not whether you have it. The question is whether you are living from it."'
    ],
    selarUrl: 'https://selar.co/REPLACE-MIND-OF-CHRIST',
    related:  ['in-him-realities', 'homologia', 'read-the-bible-right']
  },

  {
    slug:               'new-creation-man',
    title:              'New Creation Man',
    author:             'Oku Andy',
    genre:              'adult',
    genreLabel:         'Adult · Christian',
    price:              '₦3,000',
    priceRaw:           3000,
    cover:              'images/new creation man.jpeg',
    coverAlt:           'Book cover: New Creation Man',
    coverPlaceholderBg: null,
    coverPlaceholderColor: null,
    description: [
      "The New Creation Man reveals God's eternal intention to make His home with and in man. Before sin, the fall, and creation itself, God's purpose was already life and fellowship with humanity. In Christ, this eternal purpose is fulfilled as man becomes God's dwelling place. The believer is not merely visiting God's presence; he is His living tabernacle.",
      "The new creation reveals the man God always intended to have—alive with His very life. This book unveils the mystery of God dwelling in man through Christ."
    ],
    excerpt: [
      '"Old things have passed away — not as an aspiration, but as a declaration. You are not becoming new. You are new. The work is done, the verdict is final, and the new creation has already begun."'
    ],
    selarUrl: 'https://selar.co/REPLACE-NEW-CREATION-MAN',
    related:  ['in-him-realities', 'redemption-realities', 'sonship-realities']
  },

  {
    slug:               'salvation-simply-put',
    title:              'Salvation Simply Put',
    author:             'Oku Andy',
    genre:              'adult',
    genreLabel:         'Adult · Christian',
    price:              '₦2,500',
    priceRaw:           2500,
    cover:              'images/salvation simply put.jpeg',
    coverAlt:           'Book cover: Salvation Simply Put',
    coverPlaceholderBg: null,
    coverPlaceholderColor: null,
    description: [
      "What Is Salvation? Simply Put explains the message of salvation in clear, biblical, and Christ-centered language.",
      "Discover what Jesus accomplished through His death and resurrection, and what it truly means to be saved by grace through faith."
    ],
    excerpt: [
      '"The gospel is not complicated. God made it simple on purpose. It is not a formula to master — it is a Person to receive. And that Person changes everything."'
    ],
    selarUrl: 'https://selar.co/REPLACE-SALVATION-SIMPLY-PUT',
    related:  ['what-is-salvation', 'christ-our-substitute', 'redemption-realities']
  },

  {
    slug:               'sonship-realities',
    title:              'The Realities of Our Sonship',
    author:             'Oku Andy',
    genre:              'adult',
    genreLabel:         'Adult · Christian',
    price:              '₦2,800',
    priceRaw:           2800,
    cover:              'images/sonship realities.jpeg',
    coverAlt:           'Book cover: The Realities of Our Sonship',
    coverPlaceholderBg: null,
    coverPlaceholderColor: null,
    description: [
      "A journey into the believer's identity in Christ, unveiling the realities of sonship, our union with Him, and the Father's heart toward us.",
      "Discover what it truly means to live from the reality of being God's beloved sons and daughters."
    ],
    excerpt: [
      '"Sonship is not a rank you achieve. It is a reality you were born into the moment you believed. You did not earn your way into the family — you were born into it."'
    ],
    selarUrl: 'https://selar.co/REPLACE-SONSHIP-REALITIES',
    related:  ['abbas-invitation', 'in-him-realities', 'new-creation-man']
  },

  {
    slug:               'angels-are-my-buddies',
    title:              'Angels Are My Buddies',
    author:             'Oku Andy',
    genre:              'adult',
    genreLabel:         'Adult · Christian',
    price:              '₦2,800',
    priceRaw:           2800,
    cover:              'images/Angels are my buddies.jpeg',
    coverAlt:           'Book cover: Angels Are My Buddies',
    coverPlaceholderBg: null,
    coverPlaceholderColor: null,
    description: [
      'A biblically grounded exploration of the ministry of angels and their role in the life of the believer.',
      "Discover what God's Word says about these heavenly messengers and how their work is connected to your inheritance in Christ."
    ],
    excerpt: [
      '"They are not myths or metaphors. They are real, active, and assigned. God has dispatched heaven on your behalf — and it has been that way since you believed."'
    ],
    selarUrl: 'https://selar.co/REPLACE-ANGELS-ARE-MY-BUDDIES',
    related:  ['spiritual-warfare', 'most-excellent-name', 'in-him-realities']
  },

  // ── CHILDREN'S BOOKS ─────────────────────────────────────


  {
    slug:               'bible-tales-for-little-hearts',
    title:              'Bible Tales for Little Hearts',
    author:             'Aionios Life',
    genre:              'children',
    genreLabel:         "Children's · Ages 3–8",
    price:              '₦2,000',
    priceRaw:           2000,
    cover:              null,
    coverAlt:           'Book cover: Bible Tales for Little Hearts',
    coverPlaceholderBg:    '#2a4a2e',
    coverPlaceholderColor: '#c8e6c9',
    description: [
      'Bright, warm retellings of beloved Bible stories — written in simple language that children aged 3 to 8 can understand and parents will love reading aloud.',
      'Each story ends with a simple truth and a short prayer, making this book perfect for bedtime, family devotionals, or Sunday school.'
    ],
    excerpt: [
      '"Noah loved God very much. So when God said, \\"Build a big boat,\\" Noah did not ask why. He just picked up his hammer and began. Sometimes loving God means doing what He says, even when we don\'t understand yet."',
      '"And when the rain stopped and the rainbow came, God made a promise. A rainbow promise. \\"I will always love you,\\" He said. And God always keeps His promises."'
    ],
    selarUrl: 'https://selar.co/REPLACE-BIBLE-TALES',
    related:  ['gods-big-promise', 'the-shepherds-song', 'the-miracles-of-jesus']
  },

  {
    slug:               'gods-big-promise',
    title:              "God's Big Promise",
    author:             'Aionios Life',
    genre:              'children',
    genreLabel:         "Children's · Ages 4–8",
    price:              '₦2,200',
    priceRaw:           2200,
    cover:              null,
    coverAlt:           "Book cover: God's Big Promise",
    coverPlaceholderBg:    '#c05e1e',
    coverPlaceholderColor: '#fff8f0',
    description: [
      "God makes promises — and He always keeps them. This beautifully illustrated story follows a little girl called Amara as she learns what it means to trust God's promises, even when things are hard.",
      "A faith-building story for young children that introduces the concept of trust, God's faithfulness, and the peace that comes from knowing He is always in control."
    ],
    excerpt: [
      '"\\"But Mama,\\" said Amara, \\"what if God forgets?\\" Mama smiled and hugged her close. \\"Sweet girl,\\" she said, \\"God never forgets. Not even once. Every star in the sky is His reminder that He keeps His word.\\"\"',
      '"That night, Amara looked up at the stars. There were so many. She stopped counting after one hundred. And she smiled — because she knew someone had counted every one."'
    ],
    selarUrl: 'https://selar.co/REPLACE-GODS-BIG-PROMISE',
    related:  ['bible-tales-for-little-hearts', 'the-shepherds-song', 'david-and-the-giant']
  },

  {
    slug:               'the-shepherds-song',
    title:              "The Shepherd's Song",
    author:             'Aionios Life',
    genre:              'children',
    genreLabel:         "Children's · Ages 3–7",
    price:              '₦2,000',
    priceRaw:           2000,
    cover:              null,
    coverAlt:           "Book cover: The Shepherd's Song",
    coverPlaceholderBg:    '#4a6741',
    coverPlaceholderColor: '#e8f5e9',
    description: [
      "A gentle, lyrical story based on the 23rd Psalm — told through the eyes of a little lamb who learns that the Shepherd is always near, even in the darkest valleys.",
      "With warm, poetic language and an uplifting message of God's care and presence, this is a story children will want to hear again and again."
    ],
    excerpt: [
      '"\\"Do not be afraid,\\" the Shepherd said softly. \\"Even here, in the dark and the quiet, I am with you. I have always been with you. And I will never stop.\\"\"',
      '"The little lamb looked up. The stars were coming out. And though the valley was still dark, it did not feel so scary anymore — because the Shepherd was right beside her."'
    ],
    selarUrl: 'https://selar.co/REPLACE-THE-SHEPHERDS-SONG',
    related:  ['gods-big-promise', 'bible-tales-for-little-hearts', 'noah-and-the-great-flood']
  },

  {
    slug:               'noah-and-the-great-flood',
    title:              'Noah and the Great Flood',
    author:             'Aionios Life',
    genre:              'children',
    genreLabel:         "Children's · Ages 5–9",
    price:              '₦2,200',
    priceRaw:           2200,
    cover:              null,
    coverAlt:           'Book cover: Noah and the Great Flood',
    coverPlaceholderBg:    '#2c4a6b',
    coverPlaceholderColor: '#e0f0ff',
    description: [
      "The story of Noah retold with vivid detail, gentle humour, and a strong message of faith and obedience. Children will love learning how one family's trust in God changed everything.",
      'Includes conversation starters at the end of each chapter, making it ideal for reading together as a family.'
    ],
    excerpt: [
      '"Every morning, Noah would look up at the sky and say, \\"Good morning, God. What are we building today?\\" And every morning, God would answer. Because that is what happens when you talk to God — He talks back."',
      '"When the last animal walked in and the door closed, Noah did not close it himself. God did. And when God closes a door, it stays closed — and the person inside is safe."'
    ],
    selarUrl: 'https://selar.co/REPLACE-NOAH-GREAT-FLOOD',
    related:  ['bible-tales-for-little-hearts', 'david-and-the-giant', 'the-miracles-of-jesus']
  },

  {
    slug:               'david-and-the-giant',
    title:              'David and the Giant',
    author:             'Aionios Life',
    genre:              'children',
    genreLabel:         "Children's · Ages 5–10",
    price:              '₦2,000',
    priceRaw:           2000,
    cover:              null,
    coverAlt:           'Book cover: David and the Giant',
    coverPlaceholderBg:    '#8b2020',
    coverPlaceholderColor: '#fdecd7',
    description: [
      "The beloved story of David and Goliath — retold for today's children with the message that bravery is not the absence of fear, but the decision to trust God anyway.",
      "A powerful story for children who feel small, scared, or outnumbered — reminding them that with God on their side, they are never truly alone."
    ],
    excerpt: [
      '"Everyone else saw a giant. David saw an opportunity to show the world what his God could do. That is the difference faith makes — it does not change the size of the giant. It changes the size of the God you are standing with."',
      '"David ran toward the giant. He did not run away. And that is what faith looks like — not the absence of the scary thing, but running toward it with the name of the Lord on your lips."'
    ],
    selarUrl: 'https://selar.co/REPLACE-DAVID-AND-THE-GIANT',
    related:  ['noah-and-the-great-flood', 'the-miracles-of-jesus', 'gods-big-promise']
  },

  {
    slug:               'the-miracles-of-jesus',
    title:              'The Miracles of Jesus',
    author:             'Aionios Life',
    genre:              'children',
    genreLabel:         "Children's · Ages 5–10",
    price:              '₦2,500',
    priceRaw:           2500,
    cover:              null,
    coverAlt:           'Book cover: The Miracles of Jesus',
    coverPlaceholderBg:    '#6b4a00',
    coverPlaceholderColor: '#fff3cd',
    description: [
      "Eight of Jesus' miracles retold in simple, engaging language — from the feeding of the five thousand to the raising of Lazarus. Each chapter includes a short reflection on what the miracle reveals about who Jesus is.",
      'Full of wonder and written with reverence, this book helps children encounter the living Christ — not just as a historical figure, but as the One who is the same yesterday, today, and forever.'
    ],
    excerpt: [
      '"A little boy had five small loaves and two tiny fish. He gave them to Jesus. And Jesus took the little that was offered and made it into more than enough. He always does that — takes what little we have and multiplies it beyond what we can imagine."',
      '"The storm was loud and the waves were high. But the disciples forgot one thing: Jesus was in the boat. And when Jesus is in your boat, the storm does not get the last word. He does."'
    ],
    selarUrl: 'https://selar.co/REPLACE-THE-MIRACLES-OF-JESUS',
    related:  ['david-and-the-giant', 'noah-and-the-great-flood', 'the-shepherds-song']
  }

];

// ── Lookup helper ─────────────────────────────────────────────
/**
 * Find a book by its slug.
 * @param  {string} slug  e.g. "in-him-realities"
 * @returns {object|null} the book object, or null if not found
 */
function getBookBySlug(slug) {
  return BOOKS.find(book => book.slug === slug) || null;
}
