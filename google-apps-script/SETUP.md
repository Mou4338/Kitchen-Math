# Send website form submissions to Google Sheets

Every time someone submits the **"Book a free growth audit"** form (home page) or sends their **Growth Scorecard** results, a new row is added to your Google Sheet:

- **Enquiries** tab: name, restaurant, phone/WhatsApp, email, city, platforms, message
- **Scorecard** tab: name, restaurant, contact details, overall score, top priorities, score per area

The tabs and header rows are created automatically on the first submission. Setup takes about 5 minutes.

## 1. Create the sheet and the script

1. Go to https://sheets.new and name the sheet, e.g. **KitchenMath Leads**.
2. In the sheet, open **Extensions → Apps Script**.
3. Delete the sample code, then paste in everything from `google-apps-script/Code.gs`.
4. On the line `const SECRET = "change-me-to-a-long-random-string";` replace the text with your own long random string (e.g. `km-7f3a9c21e84b4d0f`). Keep it private.
5. Click **Save** (💾).

## 2. Publish it as a web app

1. Click **Deploy → New deployment**.
2. Click the ⚙️ next to "Select type" and choose **Web app**.
3. Set **Execute as: Me** and **Who has access: Anyone**. (Anyone can call the URL, but rows are only added when the secret matches.)
4. Click **Deploy**, then **Authorize access** and allow it with your Google account. If you see "Google hasn't verified this app", click **Advanced → Go to … (unsafe)**. It's your own script.
5. Copy the **Web app URL** (it ends in `/exec`).

Check it: open the URL in your browser. You should see `{"ok":true,"message":"KitchenMath sheet webhook is running."}`.

## 3. Connect the website

Add two environment variables.

**Local** (`.env.local` in the project folder):

```bash
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXXXXXX/exec
GOOGLE_SHEETS_SECRET=km-7f3a9c21e84b4d0f
```

Restart `npm run dev` after changing `.env.local`.

**Vercel:** Project → **Settings → Environment Variables** → add the same two, then **Redeploy**.

## 4. Test

Open the home page, fill the form at the bottom and press **Request my free growth audit**. A new row should appear in the **Enquiries** tab within a few seconds.

## Good to know

- **Changed the script?** Use **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**. The URL stays the same. (A *New deployment* creates a new URL, which you'd then need to update in the env vars.)
- **Email alerts for new rows:** in the sheet, **Tools → Notification settings → Edit notifications → "Any changes are made" → Email right away**.
- **Spam:** the forms have a hidden "honeypot" field that bots fill in; those submissions are silently dropped.
- **Not getting rows?** Check that the secret is identical in both places, the deployment access is **Anyone**, and the URL ends in `/exec` (not `/dev`). Vercel → your project → **Logs** shows the error if the webhook call fails.
