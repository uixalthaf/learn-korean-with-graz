import React from 'react'
import { TUTOR_NAME } from '@/config/tutorInfo'
import {  Calendar, ChartSpline, LanguagesIcon, MessagesSquare} from 'lucide-react'
const FeatureStrip = () => {
  return (
    <div className='flex flex-row gap-2 mt-10 w-full p-8 rounded-xl justify-between bg-[#EEE6D8] flex-wrap'>
            <div className='flex flex-col gap-1 items-center max-w-[200px] text-center'>
                <LanguagesIcon width={28} height={28} className='text-primary'/>
                <span className='font-bold'>Learn Hangul</span>
                <p>Start with the basics and build a strong foundation.</p>
            </div>
            <div className='flex flex-col gap-1 items-center max-w-[150px] text-center'>
                <MessagesSquare width={28} height={28} className='text-primary'/>
                <span className='font-bold'>Real Conversations</span>
                <p>Use Korean in everyday situations.</p>
            </div>
            <div className='flex flex-col gap-1 items-center max-w-[180px] text-center'>
                <Calendar width={28} height={28} className='text-primary'/>
                <span className='font-bold'>Live 1:1 or small group</span>
                <p>Interactive lessons with {TUTOR_NAME}</p>
            </div>
            <div className='flex flex-col gap-1 items-center max-w-[200px] text-center'>
               <ChartSpline width={28} height={28} className='text-primary'/>
                <span className='font-bold'>Progess with confifence</span>
                <p>Practical,supportive and structured.</p>
            </div>

        </div>
  )
}

export default FeatureStrip