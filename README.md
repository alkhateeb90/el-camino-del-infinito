# 🌟 El Camino del Infinito

**An Interactive Islamic Education Game for Young Learners**

A gamified learning platform designed specifically for 11-year-old Alfred, combining Islamic teachings with modern game mechanics inspired by Jujutsu Kaisen's Satoru Gojo character.

## 🎯 Project Overview

El Camino del Infinito is a dark-themed, highly interactive web application that transforms Islamic education into an engaging gaming experience. Each point earned equals 1¢ USD, creating a tangible reward system for learning.

### Key Features

- **6 Interactive Episodes** (Episodes 1-6 complete, ready to expand to 12+)
- **90% Pass Rate Requirement** - Students must score 90% on quizzes to unlock rewards and progress
- **USD Cent Conversion** - 1 point = 1¢ (gamified reward system)
- **Dark, Immersive Theme** - Gojo-inspired dark blue aesthetic with electric blue accents (#1E90FF)
- **Sound Effects** - Audio feedback for correct answers, wrong answers, level-ups, and success
- **Floating Animations** - Point animations and visual feedback for achievements
- **Progressive Levels** - 7-level system from "Buscador" (Seeker) to "Iluminado" (Enlightened)
- **localStorage Persistence** - Progress automatically saves across sessions
- **Mobile & Desktop Optimized** - Fully responsive design

## 📚 Episode Structure

Each episode includes:

1. **Story Pages** (3 pages per episode)
   - Gojo character guidance
   - Quranic verses with Arabic and Spanish translations
   - Real-world Islamic concepts

2. **Quiz System**
   - 5 multiple-choice questions per episode
   - Instant feedback with explanations
   - 90% minimum score required to pass

3. **Challenge System**
   - Real-world application tasks
   - Mother verification option (honor-based)
   - 50 bonus points upon completion

## 🎮 Current Episodes

### Level: Buscador (Seeker)
- **Episode 1**: El Secreto que Gojo Nunca Contó (Introduction to Allah)
- **Episode 2**: El Código de los Campeones (Islam as Success System)

### Level: Estudiante (Student)
- **Episode 3**: Tu Mamá es Sagrada (Status of Mothers)
- **Episode 4**: El Empresario Original (Prophet Muhammad as Businessman)

### Level: Conocedor (Scholar)
- **Episode 5**: La Recarga Diaria (The 5 Daily Prayers)
- **Episode 6**: Dinero Infinito (Islamic Economics)

## 🏆 Reward System

| Level | Points Required | Icon | Min Score |
|-------|-----------------|------|-----------|
| Buscador | 0 | 🔍 | 0% |
| Estudiante | 300 | 📚 | 90% |
| Conocedor | 600 | 💡 | 90% |
| Guerrero | 1000 | ⚔️ | 90% |
| Guardián | 1500 | 🛡️ | 90% |
| Maestro | 2000 | ⭐ | 90% |
| Iluminado | 2500 | ✨ | 90% |

## 🛠️ Tech Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4 + Custom CSS
- **Routing**: Wouter (lightweight router)
- **State Management**: React Hooks + localStorage
- **Build Tool**: Vite
- **UI Components**: shadcn/ui

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/alkhateeb90/el-camino-del-infinito.git
cd el-camino-del-infinito

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
pnpm build
pnpm start
```

## 📱 Responsive Design

The application is fully optimized for:
- **Mobile** (320px - 768px)
- **Tablet** (768px - 1024px)
- **Desktop** (1024px+)

All interactive elements are touch-friendly and properly sized for mobile devices.

## 🎨 Design Philosophy

### Color Scheme
- **Primary**: Electric Blue (#1E90FF) - Gojo's signature color
- **Secondary**: Islamic Gold (#C9A962) - For Quranic verses
- **Background**: Dark Slate (Gradient from #0f172a to #1e293b)
- **Accent**: Green (#22c55e) for success states

### Typography
- **Headings**: Outfit font (bold, modern)
- **Body**: System fonts (readable, clean)
- **Arabic**: Amiri font (for Quranic verses)

### Animations
- Smooth page transitions
- Point floating animations
- Level-up celebrations
- Hover effects on interactive elements

## 🔊 Sound Effects

The application includes procedurally generated sound effects:
- **Correct Answer**: 800Hz tone (100ms)
- **Wrong Answer**: 300Hz tone (200ms)
- **Level Up**: Frequency sweep (600Hz → 1000Hz)
- **Success**: Three-note chord (C major)

## 💾 Data Persistence

All progress is automatically saved to browser localStorage:
- Total points earned
- Completed episodes
- Quiz scores
- Perfect quizzes (100%)
- Completed challenges
- Earned badges
- Current level

## 🔐 Privacy & Security

- All data stored locally in browser (no server transmission)
- No external API calls for user data
- No tracking or analytics
- No third-party dependencies for data collection

## 📖 Episode Content

Episodes are loaded from `/public/complete-episodes.json` with the following structure:

```json
{
  "episodes": [
    {
      "id": 1,
      "number": 1,
      "title": "Episode Title",
      "concept": "Core Concept",
      "level": "Level Name",
      "pages": [...],
      "verse": {...},
      "quiz": [...],
      "challenge": "Challenge Description",
      "points": {...}
    }
  ]
}
```

## 🚀 Future Enhancements

### Planned Features
1. **Shield Series** (4 defensive knowledge episodes)
   - Women in Islam
   - Allah vs Jesus
   - Islamic Rules & Laws
   - The Quiet Warrior

2. **Leaderboard System** - Track progress across multiple users

3. **Achievement Badges** - Special badges for milestones

4. **Parent Dashboard** - Monitor Alfred's progress

5. **Audio Narration** - Gojo voice-over for story content

6. **Multiplayer Challenges** - Compete with friends

7. **Content Expansion** - Additional episodes beyond 12

## 🤝 Contributing

This project is customized for Alfred's learning journey. To add new episodes:

1. Add episode data to `/public/complete-episodes.json`
2. Follow the existing episode structure
3. Test quiz questions for clarity and accuracy
4. Verify Quranic verses and translations

## 📝 License

This project is created specifically for educational purposes.

## 👨‍💼 Creator

Developed with ❤️ for Alfred's Islamic education journey.

---

**GitHub**: https://github.com/alkhateeb90/el-camino-del-infinito

**Live Demo**: Available at deployment URL

**Contact**: For questions or content additions, please reach out through GitHub issues.

---

## 🎓 Educational Philosophy

El Camino del Infinito combines:
- **Islamic Teachings** - Authentic Quranic verses and Hadith
- **Gamification** - Points, levels, and achievements
- **Real-World Application** - Challenges that encourage practical implementation
- **Character-Driven Learning** - Gojo as a relatable guide and mentor
- **Progressive Difficulty** - Content scales with understanding

Every episode is designed to be completed in 5-7 minutes, making it perfect for busy schedules while maintaining depth and authenticity.

---

**Version**: 1.0.0  
**Last Updated**: December 2025  
**Status**: Active Development
