# 🌊 AQUASNAP - Marine Species Learning Platform

A gamified learning platform for marine biology and conservation, featuring interactive games, virtual aquarium management, and educational content aligned with UN Sustainable Development Goals.

## ✨ Features

### 🎮 **Interactive Learning Games**
- **Species Identification**: Learn to identify marine species through visual recognition challenges
- **Habitat Matching**: Match species to their natural habitats
- **Conservation Status Game**: Learn about endangered and protected marine life
- **Ocean Currents Navigation**: Navigate ocean currents while avoiding obstacles
- **Ecosystem Builder**: Build balanced marine ecosystems
- **Fish Rescue Mission**: Save marine life from environmental threats
- **Marine Trivia**: Test your knowledge with comprehensive marine biology questions
- **Conservation Crisis**: Learn about real-world marine conservation challenges

### 🐠 **Virtual Aquarium**
- Purchase and manage virtual fish using earned points
- Real-time aquarium simulation with animated fish
- Species care and management system
- Achievement-based rewards

### 🏆 **Achievement System**
- Certificates for completing educational milestones
- Badge collection for various accomplishments  
- Progress tracking across all learning modules

### 📚 **Educational Hub**
- Marine conservation content aligned with UN SDG
- Comprehensive marine species database
- Interactive learning materials

### 👤 **User Management**  
- Secure authentication with persistent sessions
- User profiles and progress tracking
- Points system (spendable vs. total points)
- Responsive design for desktop and mobile

## 🚀 Getting Started

### Prerequisites
- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository** (or download the project files):
   ```bash
   git clone https://github.com/YOUR-USERNAME/aquasnap-marine-learning.git
   cd aquasnap-marine-learning
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Technology Stack

- **Frontend**: Next.js 15.3, React 19, TypeScript
- **Styling**: Tailwind CSS with Radix UI components  
- **State Management**: Zustand
- **Database**: SpacetimeDB (real-time database with compute)
- **Authentication**: Custom authentication system
- **Animations**: Framer Motion

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Homepage
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components  
│   ├── games/            # Learning game components
│   ├── profile/          # User profile components
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── store/                # Zustand state management
└── data/                 # Static data (marine species info)

spacetime-server/         # SpacetimeDB backend
└── src/
    └── lib.rs           # Rust server-side logic
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production application  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌊 Game Features

### 🔍 Species Identification
Challenge yourself to identify marine species from images. Earn points for correct identifications and build your marine biology knowledge.

### 🏠 Habitat Matching  
Learn where different species live by matching them to their natural habitats - from coral reefs to deep ocean trenches.

### ⚡ Ocean Currents Navigation
Navigate through ocean currents while avoiding obstacles, learning about marine geography and oceanography.

### 🛡️ Conservation Challenges
Engage with real-world conservation scenarios and learn about protecting marine ecosystems.

## 🐠 Virtual Aquarium

Manage your own virtual aquarium using points earned through gameplay:
- Purchase different fish species
- Monitor fish health and happiness
- Create beautiful underwater environments
- Unlock rare species through achievements

## 🏆 Achievements & Rewards

- **Marine Biologist Certificate**: Complete species identification challenges
- **Conservation Hero Badge**: Finish all conservation games  
- **Ecosystem Expert**: Successfully build marine ecosystems
- **Navigation Master**: Complete ocean current challenges

## 🌍 Educational Impact

AQUASNAP aligns with UN Sustainable Development Goal 14: "Life Below Water" by:
- Raising awareness about marine conservation
- Teaching sustainable fishing practices
- Highlighting climate change impacts on oceans
- Promoting marine protected areas

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the browser console for error messages
2. Ensure all dependencies are installed (`npm install`)
3. Verify Node.js version compatibility
4. Clear browser cache and cookies

---

**Dive into marine conservation learning with AQUASNAP! 🐠🌊**