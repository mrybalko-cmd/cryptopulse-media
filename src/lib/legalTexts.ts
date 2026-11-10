/**
 * Тексты «Политики конфиденциальности» и «Условий предоставления услуг».
 *
 * Русский текст перенесён дословно из документов юриста (PDF от 07.11.2026):
 * собран скриптом из PDF и сверен с ним слово в слово. Убрана только
 * выделенная жёлтым заглушка «______(желательно указать название
 * правообладателя…)______», и по просьбе владельца исправлены три опечатки
 * (10.11.2026): «примете», «присоединиться», «подписаться». Английский —
 * перевод русского без изменений смысла.
 *
 * Править текст можно только по новой редакции от юриста. Дата в строке
 * «Последнее обновление» тоже взята из документа и меняется вместе с ним.
 */

export type LegalBlock = { h: string } | { p: string } | { ul: string[] };
export type LegalDoc = { title: string; updated: string; blocks: LegalBlock[] };

export const PRIVACY: Record<'ru' | 'en', LegalDoc> = {
  ru: {
  "title": "Политика конфиденциальности",
  "updated": "Последнее обновление: 7 ноября 2026 г.",
  "blocks": [
    {
      "p": "Настоящая Политика конфиденциальности (далее “Политика”) описывает, как правообладатель сайта Intokened.com (далее “мы”, “нас” или “наш”) собирает, использует и раскрывает информацию, которую мы получаем о посетителях нашего сайта, а также об услугах, доступных через наш сайт. Настоящая Политика также описывает ваши права в соответствии с применимым законодательством в отношении вашей личной информации."
    },
    {
      "p": "Посещая Intokened.com или пользуясь любыми нашими услугами, вы соглашаетесь с тем, что ваша информация будет собираться, использоваться и раскрываться в соответствии с настоящей Политикой."
    },
    {
      "h": "Какие данные мы собираем"
    },
    {
      "p": "Персональная информация — это данные, которые идентифицируют вас, относятся к вам, описывают вас, могут быть использованы для связи с вами или могут быть обоснованно связаны с вами прямо или косвенно."
    },
    {
      "p": "Если вы примете решение присоединиться к нашему комьюнити и подписаться на наш ресурс, вы добровольно предоставляете нам ваш адрес электронной почты."
    },
    {
      "p": "Сайт не требует регистрации и не имеет системы учётных записей. Мы можем собирать базовую техническую информацию о посещениях: страницы, которые вы просматриваете, тип устройства и браузера, приблизительную геолокацию по IP-адресу, а также данные через cookie-файлы аналитики (например, Google Analytics или аналогичные сервисы)."
    },
    {
      "h": "Как мы используем данные"
    },
    {
      "p": "Собранная информация используется нами исключительно для понимания посещаемости сайта, улучшения контента и работы сайта. Мы не продаем и не передаем личные данные третьим лицам в коммерческих или каких-либо других целях."
    },
    {
      "h": "Сторонние сервисы"
    },
    {
      "p": "Сайт использует следующие сторонние сервисы, у каждого из которых есть собственная политика конфиденциальности: Sanity (управление контентом), а также Vercel (хостинг и базовая серверная аналитика)."
    },
    {
      "h": "Как мы раскрываем собранную информацию"
    },
    {
      "p": "Мы можем раскрывать полученную от вас или о вас информацию следующим образом:"
    },
    {
      "ul": [
        "В ответ на судебный запрос. Мы можем раскрыть вашу информацию для соблюдения закона, судебного разбирательства, постановления суда или другого юридического процесса, например, в ответ на постановление суда или повестку в суд.",
        "Для защиты нас и других лиц. Мы раскрываем вашу информацию в тех случаях, когда считаем это необходимым для расследования, предотвращения или принятия мер в отношении противоправной деятельности, предполагаемого мошенничества, ситуаций, связанных с потенциальной угрозой безопасности любого лица, нарушений настоящей Политики, или в качестве доказательства в судебных разбирательствах, в которых мы участвуем.",
        "В случае передачи бизнеса. Если сайт приобретет другая компания, происходит слияние с ней или в нас могут быть инвестированы другие компании, или если какие-либо наши активы передаются или могут быть переданы другой компании, будь то в рамках процедуры банкротства или несостоятельности или иным образом, мы можем передать собранную нами информацию о вас этой другой компании. В рамках процесса передачи бизнеса мы можем раскрывать определенную вашу информацию кредиторам, аудиторам и сторонним консультантам, включая юристов и консультантов.",
        "Мы также можем раскрывать вашу информацию с вашего согласия. Например, находясь на нашем сайте, вы можете подписаться на получение маркетинговых предложений от наших спонсоров или партнеров мероприятий и дать согласие на передачу ваших персональных данных, которая будет регулироваться политикой конфиденциальности и деловой практикой соответствующей третьей стороны."
      ]
    },
    {
      "h": "Файлы cookie"
    },
    {
      "p": "Мы можем использовать функциональные и аналитические cookie-файлы. Вы можете отключить cookie в настройках своего браузера — это может ограничить часть функциональности этого сайта."
    },
    {
      "h": "Ваши права"
    },
    {
      "p": "Если вы оформили подписку на нашем сайте, то вы в добровольном порядке предоставили нам информацию о себе в виде вашей электронной почты и предоставили нам право на обработку ваших персональных данных. Если вы хотите отписаться от подписки и/или попросить нас удалить ваши данные, напишите нам по адресу info@intokened.com."
    },
    {
      "h": "Дети"
    },
    {
      "p": "Наш сайт и услуги не предназначены для детей младше 16 лет. Мы сознательно не собираем информацию о лицах младше 16 лет. Если мы обнаружим, что ребенок младше 16 лет предоставил нам личную информацию, мы предпримем шаги для удаления такой информации из нашей системы. Мы также сознательно не продаем и не передаем личную информацию детей младше 16 лет и если нам станет известно об этом, мы предпримем разумные шаги для ее удаления в кратчайшие сроки."
    },
    {
      "h": "Рекламные письма"
    },
    {
      "p": "Мы можем периодически отправлять вам рекламные электронные письма. Вы можете отказаться от получения рекламных писем, следуя инструкциям по отказу, содержащимся в электронном письме. Обратите внимание, что обработка запросов на отказ от получения рекламных писем может занять до 10 рабочих дней, как того требует действующее местное законодательство."
    },
    {
      "h": "Ссылки на сторонние ресурсы"
    },
    {
      "p": "Наш сайт может содержать ссылки на сторонние веб-сайты, которые не управляются нами. Если вы перейдете по ссылке на сторонний сайт, вы будете перенаправлены на сайт этой третьей стороны. Доступ к таким связанным веб-сайтам и их использование регулируются не настоящей Политикой, а политикой конфиденциальности этих сторонних веб-сайтов. Вы соглашаетесь с тем, что мы не несем ответственности за методы обработки информации таких сторонних веб-сайтов, включая информацию или контент, содержащиеся на таких веб-сайтах, и не контролируем действия третьих лиц, которым вы можете разрешить доступ к информации вашей учетной записи."
    },
    {
      "h": "Безопасность и хранение"
    },
    {
      "p": "Мы заботимся о безопасности вашей информации и приняли все разумные с коммерческой точки зрения меры предосторожности для защиты информации, которую мы получаем в результате использования вами сайта, от потери, неправомерного использования, несанкционированного доступа, раскрытия, изменения и уничтожения. Пожалуйста, имейте в виду, что, несмотря на наши усилия, никакие меры безопасности данных не могут гарантировать полную безопасность. Ваша информация будет надежно храниться у нас только до тех пор, пока это необходимо для наших законных деловых целей, включая выполнение любых юридических требований, или до тех пор, пока технически не станет возможным удалить или анонимизировать такую информацию."
    },
    {
      "h": "Изменения в политике"
    },
    {
      "p": "Данная политика действует с даты последнего обновления, указанной выше. Мы можем время от времени изменять эту политику, поэтому, пожалуйста, периодически проверяйте ее актуальность. Мы будем публиковать любые изменения в этой политике на нашем сайте, обновляя дату «Последнего обновления» в верхней части этой страницы. Если мы внесем какие-либо изменения в эту политику, которые существенно повлияют на нашу практику в отношении информации, которую мы ранее собирали или собираем о вас, мы также постараемся уведомить вас об этом заранее, выделив изменения на нашем сайте или отправив вам электронное письмо."
    },
    {
      "h": "Связаться с нами"
    },
    {
      "p": "Если у вас есть вопросы о конфиденциальности на нашем сайте или в рамках предоставляемых услуг, или вы хотите подать жалобу, пожалуйста, напишите нам по адресу info@intokened.com."
    }
  ]
},
  en: {
  "title": "Privacy Policy",
  "updated": "Last updated: November 7, 2026",
  "blocks": [
    {
      "p": "This Privacy Policy (the “Policy”) describes how the rights holder of the Intokened.com website (“we”, “us” or “our”) collects, uses and discloses information that we receive about visitors to our website, as well as about the services available through our website. This Policy also describes your rights under applicable law with respect to your personal information."
    },
    {
      "p": "By visiting Intokened.com or using any of our services, you agree that your information will be collected, used and disclosed in accordance with this Policy."
    },
    {
      "h": "What data we collect"
    },
    {
      "p": "Personal information is data that identifies you, relates to you, describes you, can be used to contact you, or can reasonably be linked to you, directly or indirectly."
    },
    {
      "p": "If you decide to join our community and subscribe to our resource, you voluntarily provide us with your email address."
    },
    {
      "p": "The website does not require registration and has no account system. We may collect basic technical information about visits: the pages you view, device and browser type, approximate geolocation based on IP address, as well as data through analytics cookies (for example, Google Analytics or similar services)."
    },
    {
      "h": "How we use data"
    },
    {
      "p": "The information collected is used by us solely to understand website traffic and to improve the content and operation of the website. We do not sell or transfer personal data to third parties for commercial or any other purposes."
    },
    {
      "h": "Third-party services"
    },
    {
      "p": "The website uses the following third-party services, each of which has its own privacy policy: Sanity (content management), as well as Vercel (hosting and basic server analytics)."
    },
    {
      "h": "How we disclose the information we collect"
    },
    {
      "p": "We may disclose information received from you or about you as follows:"
    },
    {
      "ul": [
        "In response to legal process. We may disclose your information to comply with the law, a judicial proceeding, a court order or other legal process, for example, in response to a court order or a subpoena.",
        "To protect us and others. We disclose your information when we believe it is necessary to investigate, prevent or take action regarding unlawful activity, suspected fraud, situations involving a potential threat to the safety of any person, violations of this Policy, or as evidence in legal proceedings in which we are involved.",
        "In the event of a business transfer. If the website is acquired by or merged with another company, or other companies may invest in us, or if any of our assets are transferred or may be transferred to another company, whether as part of a bankruptcy or insolvency proceeding or otherwise, we may transfer the information we have collected about you to that other company. As part of the business transfer process, we may disclose certain of your information to lenders, auditors and third-party advisors, including attorneys and consultants.",
        "We may also disclose your information with your consent. For example, while on our website, you may sign up to receive marketing offers from our sponsors or event partners and consent to the transfer of your personal data, which will be governed by the privacy policy and business practices of the relevant third party."
      ]
    },
    {
      "h": "Cookies"
    },
    {
      "p": "We may use functional and analytics cookies. You can disable cookies in your browser settings — this may limit some of the functionality of this website."
    },
    {
      "h": "Your rights"
    },
    {
      "p": "If you have subscribed on our website, you have voluntarily provided us with information about yourself in the form of your email address and have granted us the right to process your personal data. If you wish to unsubscribe and/or ask us to delete your data, write to us at info@intokened.com."
    },
    {
      "h": "Children"
    },
    {
      "p": "Our website and services are not intended for children under 16. We do not knowingly collect information about persons under 16. If we discover that a child under 16 has provided us with personal information, we will take steps to delete such information from our system. We also do not knowingly sell or transfer the personal information of children under 16, and if we become aware of this, we will take reasonable steps to delete it as soon as possible."
    },
    {
      "h": "Promotional emails"
    },
    {
      "p": "We may periodically send you promotional emails. You may opt out of receiving promotional emails by following the opt-out instructions contained in the email. Please note that processing requests to opt out of promotional emails may take up to 10 business days, as required by applicable local law."
    },
    {
      "h": "Links to third-party resources"
    },
    {
      "p": "Our website may contain links to third-party websites that are not operated by us. If you follow a link to a third-party site, you will be redirected to that third party’s site. Access to and use of such linked websites are governed not by this Policy but by the privacy policies of those third-party websites. You agree that we are not responsible for the information-handling practices of such third-party websites, including the information or content contained on such websites, and that we do not control the actions of third parties to whom you may grant access to your account information."
    },
    {
      "h": "Security and storage"
    },
    {
      "p": "We care about the security of your information and have taken all commercially reasonable precautions to protect the information we receive as a result of your use of the website from loss, misuse, unauthorized access, disclosure, alteration and destruction. Please be aware that, despite our efforts, no data security measures can guarantee complete security. Your information will be securely stored by us only for as long as necessary for our legitimate business purposes, including compliance with any legal requirements, or until it becomes technically possible to delete or anonymize such information."
    },
    {
      "h": "Changes to the policy"
    },
    {
      "p": "This policy is effective as of the last updated date indicated above. We may change this policy from time to time, so please check it periodically for updates. We will publish any changes to this policy on our website by updating the “Last updated” date at the top of this page. If we make any changes to this policy that materially affect our practices regarding information we have previously collected or collect about you, we will also endeavor to notify you in advance by highlighting the changes on our website or by sending you an email."
    },
    {
      "h": "Contact us"
    },
    {
      "p": "If you have questions about privacy on our website or within the services provided, or you wish to file a complaint, please write to us at info@intokened.com."
    }
  ]
},
};

export const TERMS: Record<'ru' | 'en', LegalDoc> = {
  ru: {
  "title": "Условия предоставления услуг",
  "updated": "Последнее обновление: 07 ноября 2026 г.",
  "blocks": [
    {
      "h": "Введение"
    },
    {
      "p": "Настоящие условия и положения (далее “Условия использования”) между вами и правообладателем сайта Intokened.com (далее “мы”, “нас” или “наш”) регулируют ваше использование сайта. Если вы не согласны с какой-либо частью настоящих Условий использования или Политики конфиденциальности, вы не должны использовать сайт."
    },
    {
      "h": "Право собственности"
    },
    {
      "p": "Если не указано иное, правообладатель сайта Intokened.com владеет правами, титулом и интересами в отношении сайта (включая любой контент, данные и/или аналитику, предоставляемые через сайт), а также всех его улучшений, модификаций или производных работ. В соответствии с приведенной ниже лицензией, все эти права интеллектуальной собственности сохраняются за нами. Все права, не предоставленные вам явно в настоящих Условиях использования, сохраняются за нами. Вы признаете права собственности правообладателя сайта Intokened.com и ее лицензиаров на сайт."
    },
    {
      "p": "Вы можете просматривать, загружать и распечатывать страницы из новостной рассылки, сайта и любого другого контента или контентной платформы, включенных в сайт, для личного использования, с учетом ограничений, изложенных ниже и в других разделах настоящих Условий использования."
    },
    {
      "h": "Гарантии отсутствуют"
    },
    {
      "p": "Ничто из содержащегося на данном сайте не является и не предназначено для того, чтобы являться финансовой консультацией любого рода. Если вам требуется консультация по какому-либо финансовому вопросу, вам следует обратиться к соответствующему специалисту. Вы осведомлены и соглашаетесь с тем, что правообладатель данного сайта не несет ответственность за любые убытки, которые вы понесете в результате любой финансовой сделки, независимо от того, заключили ли вы такую сделку на основании информации, полученной вами на сайте, в новостной рассылке и любой другой части сайта. Правообладатель сайта не является вашим финансовым консультантом, и при принятии финансовых решений вы остаетесь один на один со своими проблемами."
    },
    {
      "p": "Вся информация, размещенная на сайте, предоставляется «как есть» и «в наличии». Использование информации осуществляется на ваш собственный риск."
    },
    {
      "p": "Правообладатель сайта не предоставляет гарантий, не подтверждает и не несет ответственности за какие-либо продукты или услуги, рекламируемые или предлагаемые третьими лицами через сайт или любые веб-сайты или сервисы, на которые ведут гиперссылки."
    },
    {
      "h": "Ограничение ответственности"
    },
    {
      "p": "НИ ПРИ КАКИХ ОБСТОЯТЕЛЬСТВАХ НИ ОДНА ИЗ СТОРОН НАСТОЯЩЕГО ДОГОВОРА, НИ ИХ СООТВЕТСТВУЮЩИЕ РУКОВОДИТЕЛИ, ЧЛЕНЫ, АФФИЛИРОВАННЫЕ ЛИЦА, АГЕНТЫ, ДИРЕКТОРЫ, СОТРУДНИКИ, ПОСТАВЩИКИ ИЛИ ЛИЦЕНЗИАРЫ НЕ НЕСУТ ОТВЕТСТВЕННОСТИ ЗА ЛЮБЫЕ ПРЯМЫЕ, НЕПРЯМЫЕ, ШТРАФНЫЕ, СЛУЧАЙНЫЕ, СПЕЦИАЛЬНЫЕ, ПОСЛЕДСТВЕННЫЕ ИЛИ ПРИМЕРНЫЕ УЩЕРБЫ, ВКЛЮЧАЯ, ПОМИМО ПРОЧЕГО, УЩЕРБЫ ЗА ПОТЕРЮ ПРИБЫЛИ, ДЕЛОВОЙ РЕПУТАЦИИ, ВОЗМОЖНОСТИ ИСПОЛЬЗОВАНИЯ, ДАННЫХ ИЛИ ДРУГИЕ НЕМАТЕРИАЛЬНЫЕ ПОТЕРИ, ВОЗНИКАЮЩИЕ В РЕЗУЛЬТАТЕ ИСПОЛЬЗОВАНИЯ ИЛИ НЕВОЗМОЖНОСТИ ИСПОЛЬЗОВАНИЯ ЛЮБОЙ УСЛУГИ ИЛИ КОНТЕНТА, РАЗМЕЩЕННОГО НА ДАННОМ САЙТЕ. НИ ПРИ КАКИХ ОБСТОЯТЕЛЬСТВАХ ПРАВООБЛАДАТЕЛЬ САЙТА, А ТАКЖЕ ЛЮБЫЕ ИХ ДОЛЖНОСТНЫЕ ЛИЦА, ДИРЕКТОРЫ, МЕНЕДЖЕРЫ, ЧЛЕНЫ, СОТРУДНИКИ, ЛИЦЕНЗИАРЫ, ПОДРЯДЧИКИ И АГЕНТЫ (СОВМЕСТНО ИМЕНУЕМЫЕ «СВЯЗАННЫЕ СТОРОНЫ») НЕ НЕСУТ ОТВЕТСТВЕННОСТИ ЗА ЛЮБЫЕ ИНВЕСТИЦИОННЫЕ ИЛИ ФИНАНСОВЫЕ РЕШЕНИЯ, ПРИНЯТЫЕ ВАМИ В РЕЗУЛЬТАТЕ ИСПОЛЬЗОВАНИЯ ЛЮБОЙ УСЛУГИ ИЛИ ЛЮБОГО КОНТЕНТА, РАЗМЕЩЕННОГО НА ДАННОМ САЙТЕ."
    },
    {
      "h": "Изменения"
    },
    {
      "p": "Мы можем время от времени обновлять настоящие Условия использования. Мы уведомим вас о любых изменениях, разместив новые условия на этой странице, обновив «дату вступления в силу» в верхней части настоящих Условий использования и предприняв любые другие шаги, требуемые применимым законодательством (например, уведомив вас по электронной почте и/или разместив заметное уведомление на нашем сайте до вступления изменений в силу)."
    },
    {
      "p": "Рекомендуем периодически просматривать настоящие Условия использования на предмет изменений."
    },
    {
      "h": "Ссылки на сторонние ресурсы"
    },
    {
      "p": "Сайт может содержать ссылки на сторонние веб-сайты, рекламодателей, сервисы, специальные предложения или другие мероприятия или виды деятельности, а также включать контент, предоставляемый или принадлежащий третьим сторонам, которые не принадлежат и не контролируются правообладателем сайта."
    },
    {
      "p": "Правообладатель данного сайта не поддерживает и не несет никакой ответственности за такие материалы третьих сторон. Если вы получаете доступ к материалам третьих сторон через сайт, вы делаете это на свой страх и риск, и вы понимаете, что настоящие Условия использования и Политика конфиденциальности не применяются к использованию вами таких материалов третьих сторон. Кроме того, ваши взаимодействия с рекламодателями или другими третьими сторонами, представленными на данном сайте, включая оплату и доставку товаров, а также любые другие условия (например, гарантии), осуществляются исключительно между вами и соответствующей третьей стороной. Вы соглашаетесь с тем, что правообладатель данного сайта не несет ответственности за любые убытки или ущерб любого рода, связанные с вашими взаимодействиями с такими третьими сторонами."
    },
    {
      "p": "Все материалы третьих лиц остаются собственностью их поставщиков."
    },
    {
      "h": "Финансовые консультации не предоставляются."
    },
    {
      "p": "Вы подтверждаете и понимаете, что размещенная на сайте информация носит исключительно информационный и образовательный характер. Содержимое сайта не должно рассматриваться как юридическая, налоговая, инвестиционная, финансовая или иная консультация. Ничто из содержащегося на сайте не является предложением, рекомендацией, одобрением или офертой со стороны правообладателя сайта."
    },
    {
      "h": "Связаться с нами"
    },
    {
      "p": "Если у вас есть вопросы, связанные с данными Условиями, или вы хотите подать жалобу, пожалуйста, напишите нам по адресу info@intokened.com."
    }
  ]
},
  en: {
  "title": "Terms of Service",
  "updated": "Last updated: November 7, 2026",
  "blocks": [
    {
      "h": "Introduction"
    },
    {
      "p": "These terms and conditions (the “Terms of Use”) between you and the rights holder of the Intokened.com website (“we”, “us” or “our”) govern your use of the website. If you do not agree with any part of these Terms of Use or the Privacy Policy, you must not use the website."
    },
    {
      "h": "Ownership"
    },
    {
      "p": "Unless otherwise stated, the rights holder of the Intokened.com website owns the rights, title and interest in and to the website (including any content, data and/or analytics provided through the website), as well as all improvements, modifications or derivative works thereof. Subject to the license below, all such intellectual property rights are reserved by us. All rights not expressly granted to you in these Terms of Use are reserved by us. You acknowledge the ownership rights of the rights holder of the Intokened.com website and its licensors in the website."
    },
    {
      "p": "You may view, download and print pages from the newsletter, the website and any other content or content platform included in the website for personal use, subject to the restrictions set out below and in other sections of these Terms of Use."
    },
    {
      "h": "No warranties"
    },
    {
      "p": "Nothing contained on this website constitutes, or is intended to constitute, financial advice of any kind. If you require advice on any financial matter, you should consult an appropriate professional. You are aware of and agree that the rights holder of this website is not liable for any losses you incur as a result of any financial transaction, regardless of whether you entered into such a transaction on the basis of information you obtained on the website, in the newsletter or in any other part of the website. The rights holder of the website is not your financial advisor, and when making financial decisions you are left alone with your own problems."
    },
    {
      "p": "All information posted on the website is provided “as is” and “as available”. Use of the information is at your own risk."
    },
    {
      "p": "The rights holder of the website makes no warranties, does not endorse and is not responsible for any products or services advertised or offered by third parties through the website or any websites or services linked to by hyperlinks."
    },
    {
      "h": "Limitation of liability"
    },
    {
      "p": "IN NO EVENT SHALL ANY PARTY TO THIS AGREEMENT, NOR THEIR RESPECTIVE MANAGERS, MEMBERS, AFFILIATES, AGENTS, DIRECTORS, EMPLOYEES, SUPPLIERS OR LICENSORS, BE LIABLE FOR ANY DIRECT, INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR EXEMPLARY DAMAGES, INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA OR OTHER INTANGIBLE LOSSES, ARISING OUT OF THE USE OF OR INABILITY TO USE ANY SERVICE OR CONTENT POSTED ON THIS WEBSITE. IN NO EVENT SHALL THE RIGHTS HOLDER OF THE WEBSITE, OR ANY OF THEIR OFFICERS, DIRECTORS, MANAGERS, MEMBERS, EMPLOYEES, LICENSORS, CONTRACTORS AND AGENTS (COLLECTIVELY, THE “RELATED PARTIES”), BE LIABLE FOR ANY INVESTMENT OR FINANCIAL DECISIONS MADE BY YOU AS A RESULT OF USING ANY SERVICE OR ANY CONTENT POSTED ON THIS WEBSITE."
    },
    {
      "h": "Changes"
    },
    {
      "p": "We may update these Terms of Use from time to time. We will notify you of any changes by posting the new terms on this page, updating the “effective date” at the top of these Terms of Use, and taking any other steps required by applicable law (for example, notifying you by email and/or posting a prominent notice on our website before the changes take effect)."
    },
    {
      "p": "We recommend that you review these Terms of Use periodically for changes."
    },
    {
      "h": "Links to third-party resources"
    },
    {
      "p": "The website may contain links to third-party websites, advertisers, services, special offers or other events or activities, and may include content provided by or belonging to third parties that are not owned or controlled by the rights holder of the website."
    },
    {
      "p": "The rights holder of this website does not endorse and assumes no responsibility for such third-party materials. If you access third-party materials through the website, you do so at your own risk, and you understand that these Terms of Use and the Privacy Policy do not apply to your use of such third-party materials. In addition, your dealings with advertisers or other third parties featured on this website, including payment for and delivery of goods, as well as any other terms (for example, warranties), are solely between you and the relevant third party. You agree that the rights holder of this website is not liable for any losses or damage of any kind related to your dealings with such third parties."
    },
    {
      "p": "All third-party materials remain the property of their providers."
    },
    {
      "h": "No financial advice is provided."
    },
    {
      "p": "You acknowledge and understand that the information posted on the website is for informational and educational purposes only. The content of the website should not be construed as legal, tax, investment, financial or other advice. Nothing contained on the website constitutes a proposal, recommendation, endorsement or offer on the part of the rights holder of the website."
    },
    {
      "h": "Contact us"
    },
    {
      "p": "If you have any questions regarding these Terms or wish to file a complaint, please write to us at info@intokened.com."
    }
  ]
},
};
