export interface EducationalArticle {
  id: string
  title: string
  category: "pregnancy" | "nursing" | "nutrition" | "mental-health" | "exercise" | "general"
  description: string
  content: string
  readTime: number
  tags: string[]
  imageQuery: string
}

export const educationalContent: EducationalArticle[] = [
  {
    id: "1",
    title: "Understanding Prenatal Nutrition",
    category: "nutrition",
    description: "Essential nutrients and dietary guidelines for a healthy pregnancy",
    readTime: 8,
    tags: ["nutrition", "pregnancy", "vitamins"],
    imageQuery: "healthy pregnancy nutrition food",
    content: `
# Understanding Prenatal Nutrition

Proper nutrition during pregnancy is crucial for both mother and baby's health. Here's what you need to know.

## Essential Nutrients

### Folic Acid
Folic acid is vital for preventing neural tube defects. Aim for 400-800 mcg daily through supplements and folate-rich foods like leafy greens, citrus fruits, and fortified cereals.

### Iron
Iron supports increased blood volume and prevents anemia. Pregnant women need about 27mg daily. Good sources include lean red meat, poultry, fish, and iron-fortified cereals.

### Calcium
Calcium builds strong bones and teeth. Aim for 1,000mg daily through dairy products, fortified plant milk, leafy greens, and supplements if needed.

### Protein
Protein supports tissue growth and fetal development. Include lean meats, eggs, beans, nuts, and dairy in your diet.

## Foods to Avoid

- Raw or undercooked meat, eggs, and seafood
- Unpasteurized dairy products
- High-mercury fish (shark, swordfish, king mackerel)
- Excessive caffeine (limit to 200mg daily)
- Alcohol

## Healthy Eating Tips

1. Eat small, frequent meals to manage nausea
2. Stay hydrated with 8-10 glasses of water daily
3. Choose whole grains over refined carbohydrates
4. Include colorful fruits and vegetables
5. Listen to your body's hunger cues

Remember to consult with your healthcare provider about your specific nutritional needs and any supplements you should take.
    `,
  },
  {
    id: "2",
    title: "Breastfeeding Basics: Getting Started",
    category: "nursing",
    description: "A comprehensive guide to successful breastfeeding for new mothers",
    readTime: 10,
    tags: ["breastfeeding", "newborn", "nursing"],
    imageQuery: "mother breastfeeding baby",
    content: `
# Breastfeeding Basics: Getting Started

Breastfeeding is a natural process, but it can take time and practice. Here's everything you need to know to get started.

## Benefits of Breastfeeding

- Provides optimal nutrition for your baby
- Boosts baby's immune system
- Promotes bonding between mother and baby
- Helps mother's uterus return to pre-pregnancy size
- May reduce risk of certain cancers for mother

## Getting Started

### The First Hour
Try to breastfeed within the first hour after birth. This "golden hour" helps establish breastfeeding and provides important colostrum.

### Proper Latch
A good latch is key to successful breastfeeding:
- Baby's mouth should be wide open
- Both lips should be flanged outward
- You should see more areola above baby's top lip than below
- Breastfeeding should not be painful

### Positioning
Common positions include:
- Cradle hold
- Cross-cradle hold
- Football hold
- Side-lying position

## Frequency and Duration

Newborns typically feed 8-12 times in 24 hours. Let your baby nurse as long as they want on one breast before offering the other.

## Common Challenges

### Sore Nipples
Usually caused by poor latch. Ensure proper positioning and consider using lanolin cream.

### Engorgement
Apply warm compresses before feeding and cold compresses after. Nurse frequently to relieve pressure.

### Low Milk Supply
Nurse frequently, stay hydrated, get adequate rest, and consider consulting a lactation consultant.

## When to Seek Help

Contact a lactation consultant or healthcare provider if:
- Breastfeeding is painful
- Baby isn't gaining weight
- You notice signs of infection (fever, red streaks on breast)
- You have concerns about milk supply

Remember, every breastfeeding journey is unique. Be patient with yourself and your baby as you both learn.
    `,
  },
  {
    id: "3",
    title: "Managing Pregnancy Discomforts",
    category: "pregnancy",
    description: "Natural remedies and tips for common pregnancy symptoms",
    readTime: 7,
    tags: ["pregnancy", "symptoms", "comfort"],
    imageQuery: "pregnant woman relaxing comfortable",
    content: `
# Managing Pregnancy Discomforts

Pregnancy brings many changes to your body. Here are ways to manage common discomforts.

## Morning Sickness

- Eat small, frequent meals
- Keep crackers by your bedside
- Try ginger tea or ginger candies
- Avoid strong smells
- Stay hydrated with small sips throughout the day

## Fatigue

- Rest when you can
- Go to bed earlier
- Take short naps during the day
- Maintain light exercise
- Eat iron-rich foods

## Back Pain

- Practice good posture
- Wear supportive shoes
- Use a pregnancy pillow for sleep
- Try prenatal yoga or swimming
- Apply warm compresses

## Heartburn

- Eat smaller, more frequent meals
- Avoid spicy and fatty foods
- Don't lie down immediately after eating
- Sleep with your head elevated
- Wear loose-fitting clothing

## Swelling

- Elevate your feet when sitting
- Avoid standing for long periods
- Stay hydrated
- Reduce sodium intake
- Wear comfortable shoes

## Leg Cramps

- Stretch before bed
- Stay hydrated
- Ensure adequate calcium and magnesium
- Massage the affected muscle
- Apply heat to the cramped area

## When to Call Your Doctor

Contact your healthcare provider if you experience:
- Severe or persistent pain
- Heavy bleeding
- Severe headaches
- Vision changes
- Decreased fetal movement
- Signs of preterm labor

Remember, while these discomforts are common, you should always discuss any concerns with your healthcare provider.
    `,
  },
  {
    id: "4",
    title: "Postpartum Mental Health",
    category: "mental-health",
    description: "Understanding and managing postpartum emotions and mental health",
    readTime: 9,
    tags: ["mental health", "postpartum", "depression"],
    imageQuery: "mother mental health support",
    content: `
# Postpartum Mental Health

Taking care of your mental health after childbirth is just as important as physical recovery.

## Baby Blues vs. Postpartum Depression

### Baby Blues (Common)
- Affects up to 80% of new mothers
- Symptoms appear within first few days
- Include mood swings, crying, anxiety
- Usually resolve within 2 weeks

### Postpartum Depression (Requires Treatment)
- Affects 10-20% of new mothers
- Symptoms persist beyond 2 weeks
- More severe and interfering with daily life
- Requires professional help

## Signs of Postpartum Depression

- Persistent sadness or hopelessness
- Loss of interest in activities
- Difficulty bonding with baby
- Changes in appetite or sleep
- Thoughts of harming yourself or baby
- Severe anxiety or panic attacks

## Self-Care Strategies

### Physical Care
- Get as much sleep as possible
- Eat nutritious meals
- Stay hydrated
- Gentle exercise when cleared by doctor

### Emotional Care
- Accept help from others
- Connect with other new mothers
- Set realistic expectations
- Practice self-compassion
- Take breaks when needed

### Social Support
- Talk to your partner about your feelings
- Join a new mothers' support group
- Stay connected with friends and family
- Consider professional counseling

## When to Seek Help

Don't wait to get help if you're struggling. Contact your healthcare provider if:
- Symptoms persist beyond 2 weeks
- You have thoughts of harming yourself or baby
- You're unable to care for yourself or baby
- Symptoms are getting worse

## Treatment Options

- Therapy (cognitive-behavioral therapy, interpersonal therapy)
- Support groups
- Medication (safe options available while breastfeeding)
- Lifestyle modifications

## For Partners and Family

- Watch for warning signs
- Offer practical help
- Listen without judgment
- Encourage professional help if needed
- Take care of your own mental health

Remember, postpartum depression is treatable, and seeking help is a sign of strength, not weakness.
    `,
  },
  {
    id: "5",
    title: "Safe Exercise During Pregnancy",
    category: "exercise",
    description: "Guidelines for staying active and healthy throughout pregnancy",
    readTime: 6,
    tags: ["exercise", "pregnancy", "fitness"],
    imageQuery: "pregnant woman exercising yoga",
    content: `
# Safe Exercise During Pregnancy

Staying active during pregnancy offers numerous benefits for both you and your baby.

## Benefits of Exercise

- Reduces back pain and discomfort
- Improves mood and energy
- Helps manage weight gain
- Improves sleep quality
- Prepares body for labor
- Faster postpartum recovery

## Safe Exercises

### Recommended Activities
- Walking
- Swimming and water aerobics
- Stationary cycling
- Prenatal yoga
- Low-impact aerobics
- Strength training with light weights

### Exercises to Avoid
- Contact sports
- Activities with fall risk
- Hot yoga or hot Pilates
- Scuba diving
- High-altitude activities
- Exercises lying flat on back (after first trimester)

## Exercise Guidelines

### General Rules
- Aim for 150 minutes of moderate activity per week
- Stay hydrated
- Avoid overheating
- Listen to your body
- Warm up and cool down

### Warning Signs to Stop
- Dizziness or faintness
- Chest pain
- Headache
- Muscle weakness
- Calf pain or swelling
- Vaginal bleeding
- Decreased fetal movement
- Contractions

## Trimester-Specific Tips

### First Trimester
- Continue your regular routine if comfortable
- Avoid overheating
- Stay hydrated
- Modify as needed for fatigue

### Second Trimester
- Avoid exercises on your back
- Focus on posture and balance
- Strengthen pelvic floor muscles
- Modify high-impact activities

### Third Trimester
- Reduce intensity as needed
- Focus on flexibility and breathing
- Practice pelvic floor exercises
- Prepare for labor with specific exercises

## Pelvic Floor Exercises

Kegel exercises strengthen pelvic floor muscles:
1. Identify the muscles (stop urination midstream)
2. Contract for 5 seconds
3. Relax for 5 seconds
4. Repeat 10 times, 3 times daily

## Getting Started

- Consult your healthcare provider first
- Start slowly if new to exercise
- Consider prenatal fitness classes
- Work with a certified prenatal fitness instructor
- Modify exercises as pregnancy progresses

Remember, every pregnancy is different. Always consult with your healthcare provider before starting or continuing an exercise program.
    `,
  },
  {
    id: "6",
    title: "Understanding Your Baby's Development",
    category: "pregnancy",
    description: "Week-by-week guide to fetal development during pregnancy",
    readTime: 12,
    tags: ["pregnancy", "fetal development", "trimester"],
    imageQuery: "pregnancy ultrasound baby development",
    content: `
# Understanding Your Baby's Development

Learn about the amazing journey of fetal development throughout pregnancy.

## First Trimester (Weeks 1-12)

### Weeks 1-4
- Fertilization and implantation occur
- Embryo begins to form
- Neural tube develops (becomes brain and spinal cord)
- Heart begins to beat

### Weeks 5-8
- Major organs begin to form
- Facial features start developing
- Arms and legs begin to bud
- Baby is about the size of a raspberry

### Weeks 9-12
- All major organs are formed
- Baby can make movements
- Fingers and toes are distinct
- Baby is about 2-3 inches long

## Second Trimester (Weeks 13-26)

### Weeks 13-16
- Baby can hear sounds
- Skeleton begins to harden
- Baby starts to move more
- Gender may be visible on ultrasound

### Weeks 17-20
- Baby develops sleep-wake cycles
- You may feel baby's movements
- Vernix (protective coating) covers skin
- Baby is about 6-7 inches long

### Weeks 21-26
- Baby's lungs develop
- Brain develops rapidly
- Baby can respond to sounds
- Eyes begin to open

## Third Trimester (Weeks 27-40)

### Weeks 27-32
- Baby can open and close eyes
- Brain continues rapid development
- Baby gains weight quickly
- Bones are fully formed but still soft

### Weeks 33-36
- Baby's immune system develops
- Most organs are mature
- Baby settles into head-down position
- Baby is about 18 inches long

### Weeks 37-40
- Baby is considered full-term at 37 weeks
- Lungs are fully mature
- Baby gains about 0.5 pounds per week
- Baby is ready for birth

## Important Milestones

### When You Might Feel Movement
- First-time mothers: 18-20 weeks
- Experienced mothers: 16-18 weeks

### When Baby Can Hear
- Around 18 weeks
- Responds to sounds by 25 weeks

### When Baby's Eyes Open
- Around 26-28 weeks

### When Baby Can Survive Outside Womb
- Viability begins around 24 weeks
- Better outcomes after 28 weeks
- Full-term is 37-40 weeks

## Prenatal Care Importance

Regular prenatal visits help monitor:
- Baby's growth and development
- Your health and well-being
- Potential complications
- Preparation for delivery

## What Affects Development

### Positive Factors
- Proper nutrition
- Prenatal vitamins
- Regular prenatal care
- Adequate rest
- Stress management

### Risk Factors
- Smoking
- Alcohol consumption
- Drug use
- Certain medications
- Infections
- Poor nutrition

Remember, every baby develops at their own pace. Your healthcare provider will monitor your baby's growth and development throughout your pregnancy.
    `,
  },
]

export function getArticlesByCategory(category: string): EducationalArticle[] {
  if (category === "all") return educationalContent
  return educationalContent.filter((article) => article.category === category)
}

export function getArticleById(id: string): EducationalArticle | undefined {
  return educationalContent.find((article) => article.id === id)
}

export function searchArticles(query: string): EducationalArticle[] {
  const lowerQuery = query.toLowerCase()
  return educationalContent.filter(
    (article) =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.description.toLowerCase().includes(lowerQuery) ||
      article.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
  )
}
