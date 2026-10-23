import { Button } from '@/components/ui/Button/Button'
import { TUTOR_NAME } from '@/config/tutorInfo'
import { ArrowRight, MailIcon, VideotapeIcon } from 'lucide-react'
import getStartedBannerVector from '@/assets/images/get_started_banner_vector.png';
import React from 'react'

const Footer = () => {
  return (
    <div className='mb-6'>
        <div className='flex justify-between items-center bg-primary mt-6 p-6 rounded-xl'
        style={{
            backgroundImage:`url('${getStartedBannerVector.src}')`,
            backgroundPosition:'-232px 386px',
        }}>
            <div className='flex flex-col gap-2 text-white!'>
   <span className='uppercase'>Ready to start?</span>
            <h2 className='text-white!'>Let's Make Korean a part of your story.</h2>
            <span>Join today and take the first step towards Korean learning.</span>
            </div>
            <Button variant='secondary'>
                Get Started <ArrowRight/>
            </Button>
         

        </div>

        <div className='flex justify-between mt-6 items-center'>
            <div>
                  <span className="">    Learn Korean </span>
      
          <div className="text-primary text-xs uppercase">with {TUTOR_NAME}</div>
            </div>
            <div>
                <MailIcon/>
            </div>
        </div>
    </div>
  )
}

export default Footer