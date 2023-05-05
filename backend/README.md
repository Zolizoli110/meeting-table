# Backend

## Elsö lépések
1. Csinálj egy [google cloud console](https://console.cloud.google.com/welcome) projectet.
2. Az *APIs & Services > Enable APIs & services* menüpontban add hozzá a *Google Calendar API*-t.
3. Menj a *Credentials* oldalra és hozz létre egy API kulcsot, Oauth client ID-t és Service Account-ot.
    >A hozzáadáshoz nyomj az oldal tetején a *CREATE CREDENTIALS* gombra és kövesd a lépéseket.
4. Menj az *OAuth consent screen* menüpontra és töltsd ki a kötelezö adatokat
    >A *Scopes* lépésnél add hozzá a `user.profile` és `user.email` scope-okat.
5. Töltsd fel a `.env` fájlt a megfelelő adatokkal

## Áttekintés

#### config.ts
.env fájl felhasználására a projectben. Ha új változót szeretnél használni, vedd fel ebben a fájlban is.

#### prisma-errors.ts
A prisma errorokat HTTP Kóddá alakítja

#### reservation resource

- **reservation service**  
    - **getAll:**  
        vissza adja az összes reservation-t az adatbázisból
    - **getOne:**  
        vissza adja a megadott id-jű reservation-t
    - **create:**  
        meghívja a `CalendarService.uploadGoogleEvent`-et ami létre hoz a google naptárban egy eventet majd sikeres létrehozás után letölti a változást az adatbázisba
    - **update:**  
        meghívja a `CalendarService.updateGoogleEvent`-et amely frissíti a google naptárban az adott eventet majd letölti a változást az adatbázisba
    - **delete:**  
        meghívja a `CalendarService.deleteGoogleEvent` a megaadott id-val ami törli az eventet a google naptárból majd letölti a változást az adatbázisba
- **reservavtion controller**  
    Mindegyik end-point meghívja a `reservation service`-ből a megfelelő metódust
- **dto-k**  
    - **create dto:**  
        Minden adatot bekér ami szükséges egy Google Calendar esemény létrehozásához és leellenőrzi, hogy az adott adat megfelelően van e megadva.
    - **update dto:**
        A PartialType-nak köszönhetően opcionálisan minden adatot tartalmazhat amit a create dto és még pluszba a megadott opcionális adatokat.

#### meeting_room resource
>Egy meeting room megfelel a Google Calendarban levő naptárnak

- **meeting_room service:**  
    - **getAll:**  
        Vissza adja az összes meeting room-ot az adatbázisból
    - **getOne:**  
        Vissza adja a megfelelő id-ű meeting room-ot
    - **create:**  
        Meghívja a `CalendarService.SubscribeToCalendar`-t a naptár id-jával amely feliratkoztatja a service account-ot a megfelelő id-jű naptárra, majd frissíti a meeting room-ok listáját a google-től kapott naptárral.
    - Tovább részlet:  
        - [Új naptár létrehozása](https://support.google.com/calendar/answer/37095?hl=hu)
        - [Oszd meg a naptárat a Service account-al](https://support.google.com/calendar/answer/37082?hl=en&ref_topic=10510447&sjid=8166733494363637669-EU)
   - **delete:**  
        Meghívja a `CalendarService.UnsubscribeFromCalendar`-t a naptár id-jával ami leiratkoztatja a service account-ot a naptárról, majd szinkronizálja a meeting room-ok listáját a google calendárokkal.

#### guest resource
>Egy guest egyenlő egy felhasználóval.

#### calendar resource  
A calendar service tartalmaz mindent ami a Google Calendar API-hoz tartozik/szükséges.  
- **Service Account:**  
    - A calendar service konstruktorában authentikáljuk a service accountot.
    - subscribeToCalendar: [Calendar API > CalendarList > insert](https://developers.google.com/calendar/api/v3/reference/calendarList/insert)
    - unsubscribeFromCalendar: [Calendar API > CalendarList > delete](https://developers.google.com/calendar/api/v3/reference/calendarList/insert)
- **Calendars**
    - calendarListSyncHandler:
        - Megnézi, hogy van e már a google által kapott synxToken
        - Ha van akkor letölti a változásokat
        - Ha nincs letölti az összes calendart
        - Mind 2 esetben megfog hívódni az eventSyncHandler
        - További információ: [Calendar API > CalendarList > list](https://developers.google.com/calendar/api/v3/reference/calendarList/list)
- **Events**
    - syncEventOfAllCalendar:
        - lekéri az összes meeting room-ot az adatbázisból majd mindegyikre meghívja az eventSyncHandlert
    - eventSyncHandler:
        - egy adott calendarárra/meetinf room eventjeire elvégzi ugyan azt mint a calendarListSyncHandler
        - További Információ: [Calendar API > Events > list](https://developers.google.com/calendar/api/v3/reference/events/list)
    - uploadGoogleEvent: 
        - elkészít egy eventet a google altál elfogadott típusnak megfelelően majd feltölti azt
        - További információ: [Calendar API > Events > insert](https://developers.google.com/calendar/api/v3/reference/events/insert)
    - deleteGoogleEvent:  
        - [Calendar API > Events > delete](https://developers.google.com/calendar/api/v3/reference/events/delete)
    - updateGoogleEvent:
        - elkészít egy eventet a google-nek megfelelő formátumban aztán frisíti a már meglévőt
        - További információ: [Calendar API > Events > update](https://developers.google.com/calendar/api/v3/reference/events/update)