import { TUTOR_NAME } from '@/config/tutorInfo'
import Image from 'next/image'
import React from 'react'
import learningLanguageQuote from '@/assets/images/language_learning_quote.png';
import tutorImage from '@/assets/images/tutor_image.png'
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';

const TutorIntro = () => {
  return (
   <div className='flex mt-8 gap-4 items-center'>
    {/* <div>
<Image src={tutorImage} alt="" />
    </div> */}
    <div className='flex flex-col gap-3 flex-1'>
        <span className='uppercase'>meet your tutor</span>
        <h2>Hi I am {TUTOR_NAME}</h2>
        <p>Hi, I’m Graz! I teach <b>Korean</b>, and my goal is to make it feel fun instead of overwhelming. My courses start with Hangul and build up to real conversations, one small step at a time. I’m still a language learner myself, so I know how frustrating it gets, and that’s why my lessons are clear and easy to follow, with plenty of real examples, bits of Korean culture, and a lot of encouragement. <br />
         Maybe you’re learning for a trip, for work, or just because you love Korea. Whatever the reason, I’d love to help you get there.</p>
 <Button variant='primary' className='mt-4 w-fit'>
    Know More About Me <ArrowRight/>
 </Button>
    </div>

    <div className='min-w-[200px] max-w-[350px] min-h-[300px]'>
        <Image src={learningLanguageQuote} alt="" className='object-fit'/>

    </div>

   </div>
  )
}

export default TutorIntro