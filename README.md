# whatsapp-reminders-bot
Lightweight Whatsapp bot for reminders based on baileys



| Features |  |
|-- |--|
| Reminders | ✔️ |
| Roles | ✔️ |
| Tag everyone | ✔️ |
| Tag role | ✔️ |
| Image to Sticker | ✔️ |
| Random Jokes (from reddit) | ✔️ |
| Random Memes (from reddit) | ✔️ |
| Random Quotes | ✔️ |
| Love meter | ✔️ |
| Voting | :x: |


###
Please setup your .env, see .env.example file 

Command List -> should match this format /{prefix} {command}

- help 
    (Show this message)

- reminders
    - reminders add :time msg :msg 
    (Add reminder)

    - reminders add :time interval :interval repeat msg :msg 
    (Add repeated reminder, don't forget to set the interval)

    - reminders list 
    (Get active reminders )

    - reminders list with past 
        (Get all reminders including past schedule / non active shedule)

    - reminders delete :id 
        (Delete reminder, get the id from list command)

    - reminders delete with past :id 
        (Delete reminder including non active / past schedule, get the id from list with past command)

- sticker please 
    (Convert image to sticker) Note : Use as a caption of your image, only support image for now

- quotes please 
    (Get random quotes)

- love meter :nama and :nama
    (Calculate your Love compatibility & chances of successful love relationship)

- jokes
    - joke pls
        (Get random joke)

    - dark joke pls
        (Get random dark joke)

- meme pls
    (Get random meme)

- create role :name
    (Create role with given name)

- delete role :name
    (Delete role)

- roles
    - roles
        (See all roles in this group chat)

    - assign :mentions... to role :name
        (Assign all mentioned users to a role)

    - remove :mentions... from role :name
        (Remove all mentioned users from a role)

    - users in role :name
        (See all users assigned to the role)
