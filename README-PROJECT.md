# For Her — From Vijay ❤️

A beautiful, romantic, frontend-only website created with love.

## 🎨 What's Included

### ✅ Fully Working Features:

1. **Onboarding** - Name input, PIN lock, theme selection
2. **Lock Screen** - Secure PIN protection
3. **Home Dashboard** - 14 beautiful feature cards
4. **Daily Love Message** - Daily rotating messages with favorites
5. **Our Story Timeline** - Slideshow of your journey together
6. **Jar of Hearts** - Random love notes picker
7. **Settings** - Customize name, theme, and PIN

### 🎯 Features Ready for Content (Placeholder Pages):

8. Voice Notes
9. Mood Buttons
10. Daily Affirmations
11. My Songs
12. My Shayaris
13. Shared Photo Album
14. Love Calendar
15. Fun Zone (Games)
16. Special Events
17. Food Picker
18. Proposal Ideas

## 📁 Project Structure

```
/assets/          # ADD YOUR MEDIA FILES HERE
├── images/              # General images
├── photos/              # Your photo memories
├── songs/               # MP3 audio files
├── voices/              # Voice recordings
├── shayariVoice/        # Shayari voice notes
├── moods/               # Mood section media
├── food/                # Food images
└── proposals/           # Proposal images

/src/data/               # CUSTOMIZE YOUR CONTENT HERE
├── messages.json        # Daily love messages
├── songs.json           # Song list with metadata
├── shayaris.json        # Shayari texts and translations
├── timeline.json        # Your story milestones
├── jarNotes.json        # Random love notes
├── affirmations.json    # Daily affirmations
├── foodOptions.json     # Food choices
├── proposals.json       # Proposal ideas
├── calendar.json        # Important dates
├── moods.json           # Mood responses
├── voiceNotes.json      # Voice note metadata
├── photos.json          # Photo metadata
└── quizzes.json         # Fun zone games
```

## 🚀 How to Set Up & Customize

### Step 1: Clone to Your Computer

```bash
git clone <your-repo-url>
cd <your-project-folder>
npm install
npm run dev
```

### Step 2: Add Your Media Files

1. Create folders in `/assets/` (see structure above)
2. Add your files:
   - **Songs**: `.mp3` files in `/assets/songs/`
   - **Voice Notes**: `.mp3` files in `/assets/voices/`
   - **Photos**: `.jpg` or `.png` in `/assets/photos/`
   - **Other Images**: In appropriate folders

### Step 3: Customize Content

Edit the JSON files in `/src/data/` to match your story:

#### Example: messages.json

```json
{
  "id": "msg1",
  "title": "Your Custom Title",
  "message": "Your personal message...",
  "image": "/assets/images/your-image.jpg",
  "voiceNote": "/assets/voices/your-voice.mp3",
  "emoji": "❤️"
}
```

### Step 4: Update File Paths

Make sure file paths in JSON match your actual file names in `/assets/`

## 🎨 Design Features

- **Romantic Color Palette**: Rose, lavender, peach, gold
- **Handwriting Font**: Dancing Script for special touches
- **Smooth Animations**: Floating hearts, fade-ins, sparkles
- **Dark/Light Mode**: Fully themed
- **Mobile First**: Responsive on all devices
- **Local Storage**: All data persists in browser

## 🔐 Security Features

- PIN lock protection
- All data stored locally in browser
- No backend required
- Completely private

## 📝 Customization Tips

### Colors

Edit `/src/index.css` to change colors:

```css
--rose: 340 82% 67%;
--lavender: 280 60% 85%;
--peach: 25 90% 85%;
```

### Fonts

Change fonts in `/index.html` and `/tailwind.config.ts`

### Add More Messages

Just add more entries to any JSON file following the existing format

## 🎯 Completing the Features

The following pages have placeholder content. To make them fully functional:

1. **Copy the pattern** from `DailyMessage.tsx` or `Timeline.tsx`
2. **Create new page components** in `/src/pages/`
3. **Update routing** in `App.tsx`
4. **Use the data** from corresponding JSON files

Example structure:

```tsx
import data from "@/data/yourdata.json";
// Build your page component
```

## 💝 First-Person Voice

All content is written in first-person as Vijay:

- "I made this for you"
- "I love you"
- "I wrote this message"

Keep this voice consistent when adding content!

## 🌟 Special Features

### Daily Messages

- Rotates based on day of year
- Unlock and favorite system
- Optional voice notes

### Timeline

- Slideshow mode
- Polaroid-style presentation
- Navigation between moments

### Jar of Hearts

- Random note picker
- Tracks used notes
- 40+ pre-written love notes

### Settings

- Change name
- Update PIN
- Switch themes
- Clear all data

## 📱 How She Uses It

1. **First Visit**: Onboarding flow (name + PIN + theme)
2. **Return Visits**: PIN lock screen
3. **Home**: Beautiful dashboard with all features
4. **Explore**: Each card opens a special experience
5. **Settings**: Customize experience anytime

## 🎁 Made with Love

This website is:

- ✅ 100% frontend (no server needed)
- ✅ Works offline
- ✅ Completely private
- ✅ Fully customizable
- ✅ Mobile responsive
- ✅ Beautiful animations

## 🚀 Deployment

### Option 1: GitHub Pages

```bash
npm run build
# Upload 'dist' folder to GitHub Pages
```

### Option 2: Lovable

Click "Publish" button in Lovable interface

### Option 3: Any Static Host

Deploy the `dist` folder to:

- Netlify
- Vercel
- Firebase Hosting
- Any static host

## 💡 Tips

- Test on mobile - it's designed mobile-first!
- Add high-quality images for best experience
- Keep voice notes under 3 minutes for quick loading
- Compress images before adding (use tools like TinyPNG)
- Back up your JSON files regularly

## ❤️ Final Notes

This is a labor of love. Take your time customizing it with your memories, your voice, your story. Every detail matters when it comes from the heart.

Made with ❤️ by Vijay
