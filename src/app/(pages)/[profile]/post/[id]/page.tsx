"use client"

import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

interface pageProps {

}

const page: React.FC<pageProps> = ({ }) => {
    const path = usePathname()
    const router = useRouter()

    if (!path.startsWith('/@')) {
        const newPath = '/@' + path.replace(/^\//, '')
        router.push(newPath);
        return null;
    }
    return (
        <div className="flex flex-col items-start gap-1">
            <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-3 w-[620px]">
                    <div className="flex items-center gap-2.5">
                        <div className="lightgray 0px 0px / 100% 100% no-repeat] w-9 h-9 rounded-[1.125rem] bg-[url(<path-to-image>)," />
                    </div>
                    <div className="name flex items-center gap-1.5 py-px px-0">
                        <div className="text-black font-['Roboto'] text-[.9375rem] font-semibold leading-5">Zuck</div>
                        <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_104_209)">
                                <path fillRule="evenodd" clipRule="evenodd" d="M5.9994 0.9282L4.3914 0L3.4998 1.545H1.6296V3.4512L0 4.392L0.9282 6L0 7.6077L1.6296 8.5488V10.3203H3.4221L4.3914 12L5.9994 11.0718L7.6074 12L8.577 10.32H10.4256V8.517L12 7.6077L11.0715 6L12 4.3923L10.4256 3.4833V1.5453H8.4999L7.6074 0L5.9994 0.9282ZM8.2239 4.2957L8.9001 4.9818L5.4711 8.4318L3.4206 6.3528L4.0938 5.6754L5.4699 7.0497L8.2239 4.2957Z" fill="#0095F6" />
                            </g>
                            <defs>
                                <clipPath id="clip0_104_209">
                                    <rect width={12} height={12} fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                    <div className="flex justify-center items-start gap-2.5 py-px px-0">
                        <div className="text-[#999] text-right font-['Roboto'] text-[.9375rem] leading-5">3 d</div>
                        <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 11.25C10.6904 11.25 11.25 10.6904 11.25 10C11.25 9.30964 10.6904 8.75 10 8.75C9.30964 8.75 8.75 9.30964 8.75 10C8.75 10.6904 9.30964 11.25 10 11.25Z" fill="black" />
                            <path d="M5 11.25C5.69036 11.25 6.25 10.6904 6.25 10C6.25 9.30964 5.69036 8.75 5 8.75C4.30964 8.75 3.75 9.30964 3.75 10C3.75 10.6904 4.30964 11.25 5 11.25Z" fill="black" />
                            <path d="M15 11.25C15.6904 11.25 16.25 10.6904 16.25 10C16.25 9.30964 15.6904 8.75 15 8.75C14.3096 8.75 13.75 9.30964 13.75 10C13.75 10.6904 14.3096 11.25 15 11.25Z" fill="black" />
                        </svg>
                    </div>
                </div>
                <div className="flex flex-col items-start gap-1.5 self-stretch">
                    <div className="self-stretch text-black font-['Roboto'] text-[.9375rem] leading-5">Let's do this. Welcome to Threads. 🔥</div>
                    <div className="flex items-center gap-4 py-2 px-0">
                        <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_104_220)">
                                <path d="M0.833374 7.21699C0.833374 11.0295 4.08254 14.7887 9.15587 17.9953C9.43754 18.1645 9.77254 18.3337 10 18.3337C10.2359 18.3337 10.5717 18.1645 10.8442 17.9953C15.9167 14.7887 19.1667 11.0287 19.1667 7.21699C19.1667 3.94699 16.8709 1.66699 13.8934 1.66699C12.1692 1.66699 10.8167 2.45033 10 3.62699C9.20171 2.46033 7.84004 1.66699 6.10671 1.66699C3.13837 1.66699 0.833374 3.94699 0.833374 7.21699Z" stroke="black" strokeWidth="1.66667" />
                            </g>
                            <defs>
                                <clipPath id="clip0_104_220">
                                    <rect width={20} height={20} fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_104_222)">
                                <path d="M17.2134 14.1731C18.226 12.4215 18.5663 10.3612 18.1707 8.37703C17.7751 6.39287 16.6707 4.62058 15.0638 3.39125C13.4569 2.16192 11.4574 1.55965 9.43882 1.69694C7.42026 1.83423 5.52073 2.7017 4.09507 4.13728C2.66942 5.57287 1.81515 7.47837 1.69187 9.49783C1.56859 11.5173 2.18473 13.5126 3.42518 15.1109C4.66563 16.7092 6.44554 17.8013 8.4324 18.1831C10.4193 18.5649 12.4772 18.2103 14.2217 17.1856L18.3334 18.3331L17.2134 14.1731Z" stroke="black" strokeWidth="1.66667" strokeLinejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_104_222">
                                    <rect width={20} height={20} fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.665 7.91402C16.444 7.91402 16.232 8.00182 16.0757 8.1581C15.9195 8.31438 15.8317 8.52634 15.8317 8.74735V12.2707C15.8308 12.9931 15.5434 13.6857 15.0326 14.1966C14.5217 14.7074 13.8291 14.9948 13.1067 14.9957H8.67917L10.1717 13.5065C10.3237 13.3496 10.408 13.1392 10.4064 12.9207C10.4048 12.7022 10.3175 12.493 10.1632 12.3383C10.0089 12.1836 9.80001 12.0956 9.58151 12.0934C9.36301 12.0912 9.15238 12.1749 8.995 12.3265L6.075 15.239C5.91871 15.3953 5.83063 15.6071 5.83 15.8282V15.829C5.83 15.8482 5.84 15.864 5.84083 15.8832C5.8453 16.0857 5.92945 16.2782 6.075 16.419L8.99333 19.339C9.1505 19.4908 9.361 19.5748 9.5795 19.5729C9.798 19.571 10.007 19.4834 10.1615 19.3289C10.316 19.1744 10.4037 18.9653 10.4056 18.7469C10.4075 18.5284 10.3235 18.3179 10.1717 18.1607L8.67417 16.6624H13.1058C14.2702 16.661 15.3864 16.1979 16.2097 15.3746C17.0331 14.5513 17.4962 13.435 17.4975 12.2707V8.74735C17.4975 8.52634 17.4097 8.31438 17.2534 8.1581C17.0971 8.00182 16.886 7.91402 16.665 7.91402ZM11.3233 5.00068L9.8275 6.49652C9.74791 6.57339 9.68442 6.66534 9.64075 6.76701C9.59707 6.86868 9.57409 6.97803 9.57312 7.08868C9.57216 7.19933 9.59325 7.30907 9.63515 7.41148C9.67705 7.51389 9.73893 7.60694 9.81717 7.68518C9.89541 7.76342 9.98846 7.8253 10.0909 7.8672C10.1933 7.9091 10.303 7.93019 10.4137 7.92923C10.5243 7.92827 10.6337 7.90528 10.7353 7.8616C10.837 7.81793 10.929 7.75444 11.0058 7.67485L13.9225 4.75818C14.0789 4.60149 14.1667 4.38915 14.1667 4.16777C14.1667 3.94639 14.0789 3.73405 13.9225 3.57735L11.0058 0.660684C10.8487 0.508886 10.6382 0.424891 10.4197 0.426789C10.2012 0.428688 9.99216 0.516329 9.83765 0.670836C9.68314 0.825342 9.5955 1.03435 9.59361 1.25285C9.59171 1.47135 9.6757 1.68185 9.8275 1.83902L11.3225 3.33402H6.89167C5.7274 3.33556 4.61126 3.79875 3.78799 4.62201C2.96473 5.44527 2.50154 6.56142 2.5 7.72568V11.2499C2.5 11.4709 2.5878 11.6828 2.74408 11.8391C2.90036 11.9954 3.11232 12.0832 3.33333 12.0832C3.55435 12.0832 3.76631 11.9954 3.92259 11.8391C4.07887 11.6828 4.16667 11.4709 4.16667 11.2499V7.72568C4.16777 7.00316 4.45534 6.31056 4.96631 5.79974C5.47729 5.28892 6.16998 5.00157 6.8925 5.00068H11.3233Z" fill="black" />
                        </svg>
                        <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.3334 2.5L7.68175 8.4025M18.3334 2.5L9.74841 16.945L7.68175 8.4025M18.3334 2.5L1.66675 2.50083L7.68175 8.4025" stroke="black" strokeWidth="1.66667" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="flex items-start gap-0.5">
                <div className="flex items-start gap-1">
                    <div className="text-[#999] font-['Roboto'] text-[.9375rem] leading-5">20 910</div>
                    <div className="text-[#999] font-['Roboto'] text-[.9375rem] leading-5">replies</div>
                </div>
                <div className="text-[#999] font-['Roboto'] text-[.9375rem] leading-5">&nbsp;·&nbsp;</div>
                <div className="flex items-start gap-1">
                    <div className="text-[#999] font-['Roboto'] text-[.9375rem] leading-5">234 987</div>
                    <div className="text-[#999] font-['Roboto'] text-[.9375rem] leading-5">likes</div>
                </div>
            </div>
        </div>
    )
}

export default page