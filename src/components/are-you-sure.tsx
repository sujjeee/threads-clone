import React from 'react'
import { Card } from './ui/card'

export default function AreYouSure() {
    return (
        <div className='flex h-screen justify-center items-center'>
            <Card className='max-w-[280px] w-full rounded-2xl overflow-hidden border-[#474747] bg-[#181818]'>
                <div className='w-full flex justify-center items-center py-5 text-[16px] border-b font-bold border-[#474747]'>
                    Are you sure?
                </div>
                <div className='flex justify-center items-center'>
                    <div className='w-full flex justify-center items-center py-4 border-r border-[#474747] font-semibold'>
                        Cancel
                    </div>
                    <div className='w-full flex justify-center text-red-600 items-center py-4 border-[#474747] font-semibold'>
                        Delete
                    </div>
                </div>
            </Card>
        </div>
    )
}
