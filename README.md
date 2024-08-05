# daily challenge scraper

Really an excuse to play with the osu! api, learn oauth and stuff.

## Usage

### Making an osu! oauth app

* On the osu! website, click Settings, scroll down to OAuth, click New OAuth Application.
* Choose a name (doesn't matter) and set the "application callback URL" to `http://localhost:1237/oauth-redirect/`.
* Create the file `./private/oauth-app.json` with the following contents:

```json
{
  "client_id": "YOUR CLIENT ID",
  "client_secret": "YOUR CLIENT SECRET)",
  "redirect_uri": "http://localhost:1237/oauth-redirect/"
}
```

Do not share the contents of `./private/oauth-app.json`.

### Running the program

* Install `deno`.
* Run `deno task run`.
* Program will prompt you to authorize your account. Open the URL dumped into the console and authorize on osu!'s website.
  * Your token will be saved in `./private/auth-token.json`. Do not share this file.
  * TODO: After 24 hours the token will go stale, you'll have to manually delete this file to reauthenticate.
  * I should refresh the token when it's used, detect when it's expired and prompt to sign in again, etc.
* Program will run.