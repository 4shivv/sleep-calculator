# Slumber: Sleep Cycle Calculator

Deployed to https://slumber-nine.vercel.app/

A scientific web application that helps users optimize their sleep schedule and daily productivity by aligning with natural sleep cycles and circadian rhythms.

## Project Overview

Slumber is designed to provide users with personalized sleep and productivity recommendations based on scientific research. It aims to enhance users' daily performance by aligning their activities with their natural biological rhythms.

## Features

- **Modern Responsive Design**: Fluid mobile interface with elegant animations and dark mode support
- **Calculate Optimal Bedtimes**: Enter your wake-up time and get scientifically recommended bedtimes based on 90-minute sleep cycles
- **Calculate Optimal Wake-up Times**: Enter your bedtime and get recommended wake-up times aligned with both sleep cycles and natural daylight
- **Chronotype Analysis**: Personalized sleep recommendations based on whether you're an early bird, intermediate, or night owl
- **Comprehensive Productivity Recommendations**:
  - Optimal deep work periods based on peak alertness times in your circadian rhythm
  - Afternoon energy slump prediction with guidance on when to schedule breaks
  - Ideal nap time recommendation with duration guidance based on time of day
  - Scientific explanations for all recommendations

## Sleep Science

Slumber is built on evidence-based sleep research:

- Each sleep cycle consists of NREM and REM stages and lasts approximately 90 minutes
- The average adult needs 4-6 complete sleep cycles per night (6-9 hours)
- Waking up at the end of a sleep cycle helps you feel more refreshed
- It takes about 14 minutes for the average adult to fall asleep
- Circadian rhythm influences alertness, with typical peak performance periods occurring 2-4 hours after waking
- Post-lunch energy dip typically occurs 6-8 hours after waking
- Sleep chronotype (whether you're a morning lark or night owl) influences optimal sleep times

## Technologies Used

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- React Hooks
- Modern responsive design with fluid animations

## Getting Started

### Prerequisites

- Node.js 16.8 or later

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/slumber.git
   cd slumber
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Choose your chronotype (early bird, intermediate, or night owl)
2. Select whether to calculate from wake-up time or bedtime
3. Enter your desired time using the enhanced time picker
4. View your personalized sleep recommendations and productivity schedule
5. If using the bedtime calculator, you can select any wake-up time to see productivity recommendations

## Deployment

The app can be easily deployed to platforms like Vercel or Netlify:

```bash
npm run build
```

## Scientific References

Slumber incorporates research from multiple sleep science studies:

- Circadian timing principles in sleep-wake regulation
- REM/NREM sleep stage duration and proportions
- The effects of chronotype on optimal sleep scheduling
- The relationship between sleep cycles and daytime alertness
- Cognitive performance patterns throughout the day

## License

MIT

## Acknowledgments

- Sleep science researchers
- Next.js team for the framework
- Tailwind CSS for the styling system
