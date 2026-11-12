import logo from '@/assets/logo.svg'
import directoryImg from '@/assets/mobile/carousel/directory.png'
import hotImg from '@/assets/mobile/carousel/hot.png'
import indexImg from '@/assets/mobile/carousel/index.png'
import codeImg from '@/assets/mobile/detail/code.png'
import dictationImg from '@/assets/mobile/detail/dictation.png'
import phoneticImg from '@/assets/mobile/detail/phonetic.png'
import speedImg from '@/assets/mobile/detail/speed.png'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'

const detail = [
  {
    title: 'Phonetics and pronunciation',
    description: 'Memorize how a word sounds and its phonetic transcription at the same time',
    img: phoneticImg,
  },
  {
    title: 'Dictation mode',
    description: 'Optionally dictate each chapter when you finish it to reinforce what you learned',
    img: dictationImg,
  },
  {
    title: 'Real-time feedback',
    description: 'Shows typing speed and accuracy so you can measure your progress',
    img: speedImg,
  },
  {
    title: 'Built for programmers',
    description: 'Built-in programming word lists to boost your productivity',
    img: codeImg,
  },
]

const MobilePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = 3 // number of carousel slides
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides)
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current
      const slideWidth = container.offsetWidth

      if (currentSlide === 0) {
        container.style.transform = `translateX(-${totalSlides * slideWidth}px)`
        setTimeout(() => {
          container.style.transition = 'none'
          container.style.transform = `translateX(0)`
        }, 500)
      } else {
        container.style.transition = 'transform 0.5s ease'
        container.style.transform = `translateX(-${currentSlide * slideWidth}px)`
      }
    }
  }, [currentSlide])

  return (
    <div className="flex w-screen flex-col bg-white lg:mx-auto lg:max-w-7xl">
      <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-gray-100/50 bg-white/80 px-6 py-6 backdrop-blur-xl lg:px-12">
        <div className="flex items-center">
          <img src={logo} className="mr-4 h-10 w-10 lg:h-12 lg:w-12" alt="Qwerty Learner Logo" />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold tracking-tight text-indigo-500 lg:text-xl">Qwerty Learner</h1>
            <span className="text-xs font-normal text-gray-500">Official website</span>
          </div>
        </div>
        <a
          href="https://qwerty.kaiyi.cool/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-lg md:flex"
        >
          <span>Visit website</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
        <a
          href="https://qwerty.kaiyi.cool/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 rounded-xl bg-gray-900 px-4 py-2.5 text-sm text-white transition-all duration-200 hover:bg-gray-800 md:hidden"
        >
          <span>Website</span>
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </header>

      {/* Breadcrumb navigation */}
      <nav aria-label="Breadcrumb" className="bg-gray-50/50 px-6 py-3 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <ol className="flex items-center space-x-2 text-sm text-gray-500" itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <a href="https://qwerty.kaiyi.cool/" className="transition-colors hover:text-indigo-600" itemProp="item">
                <span itemProp="name">Home</span>
              </a>
              <meta itemProp="position" content="1" />
            </li>
            <li className="flex items-center">
              <svg className="h-4 w-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span className="font-medium text-gray-900" itemProp="name">
                Qwerty Learner Official Website
              </span>
              <meta itemProp="position" content="2" />
            </li>
          </ol>
        </div>
      </nav>

      <main role="main">
        <section
          className="relative mt-20 flex min-h-[90vh] items-center lg:mt-24"
          itemScope
          itemType="https://schema.org/SoftwareApplication"
        >
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-white to-slate-50/30"></div>

          {/* Main content */}
          <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-24 text-center">
            {/* Official website badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-5 py-2.5 text-sm font-medium text-indigo-600">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Official website</span>
            </div>

            {/* Main heading */}
            <h1 className="mb-8 text-5xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-6xl lg:text-7xl" itemProp="name">
              The <span className="text-indigo-500">English learning app</span>
              <br />
              designed for <span className="text-indigo-500">keyboard workers</span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mb-16 max-w-3xl text-xl font-light leading-relaxed text-gray-600 sm:text-2xl" itemProp="description">
              Combines typing practice with vocabulary memorization to make learning English efficient and fun
            </p>

            {/* Feature tags */}
            <div className="mb-16 flex flex-wrap justify-center gap-3" itemProp="featureList">
              {[
                'English vocabulary training',
                'IPA pronunciation practice',
                'CET-4/6 word lists',
                'Vocabulary for programmers',
                'Free online learning',
                'Fully open source',
              ].map((item, index) => (
                <span
                  key={index}
                  className="rounded-full border border-gray-200/50 bg-gray-50 px-6 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-white hover:shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* CTA button */}
            <a
              href="https://qwerty.kaiyi.cool/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-gray-900 px-10 py-5 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-gray-800 hover:shadow-2xl"
            >
              <span>Get started</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </section>

        <section className="mt-24 px-6 md:px-12 lg:mt-32 lg:px-24">
          <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-2 shadow-2xl">
            <div className="overflow-hidden rounded-2xl bg-white">
              <div
                ref={containerRef}
                style={{
                  display: 'flex',
                  transition: 'transform 0.5s ease',
                }}
              >
                <img
                  src={hotImg}
                  alt="Qwerty Learner popular word lists - practice CET-4/6, IELTS and TOEFL vocabulary online"
                  className="w-full flex-shrink-0"
                />
                <img
                  src={directoryImg}
                  alt="Qwerty Learner word list catalog - including technical English for programmers"
                  className="w-full flex-shrink-0"
                />
                <img
                  src={indexImg}
                  alt="Qwerty Learner typing practice screen - online English vocabulary training"
                  className="w-full flex-shrink-0"
                />
                <img
                  src={hotImg}
                  alt="Qwerty Learner popular word lists - practice CET-4/6, IELTS and TOEFL vocabulary online"
                  className="w-full flex-shrink-0"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-center space-x-3">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all duration-500 ${
                    currentSlide === index ? 'w-8 bg-indigo-500' : 'bg-gray-300 hover:bg-indigo-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-24 bg-gray-50/30 px-6 py-24 lg:mt-32 lg:px-24" itemScope itemType="https://schema.org/Product">
          <div className="mx-auto max-w-7xl">
            <meta itemProp="name" content="Qwerty Learner" />
            <meta
              itemProp="description"
              content="An English learning app designed for keyboard workers that combines typing practice with vocabulary memorization"
            />
            <meta itemProp="brand" content="Qwerty Learner" />

            {/* Offers Schema */}
            <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
              <meta itemProp="price" content="0" />
              <meta itemProp="priceCurrency" content="USD" />
              <meta itemProp="availability" content="https://schema.org/InStock" />
              <meta itemProp="url" content="https://qwerty.kaiyi.cool/" />
            </div>

            <h2 className="mb-6 text-center text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl xl:text-6xl">
              Core features, <span className="text-indigo-500">thoughtfully designed</span>
            </h2>
            <p className="mx-auto mb-16 max-w-3xl text-center text-xl font-light leading-relaxed text-gray-600">
              Every detail is polished for a better online English learning experience, helping programmers, students, office workers and
              all keyboard workers quickly improve their English typing speed and vocabulary
            </p>

            <div className="lg:grid lg:grid-cols-2 lg:gap-12">
              <div>
                {detail.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={`my-6 cursor-pointer rounded-2xl border px-8 py-8 transition-all duration-300 ${
                        activeIndex === index
                          ? 'scale-[1.02] transform border-indigo-200 bg-indigo-50/50 shadow-xl'
                          : 'border-gray-200 bg-white/50 hover:scale-[1.01] hover:transform hover:border-gray-300 hover:bg-white hover:shadow-lg'
                      }`}
                      onClick={() => setActiveIndex(index)}
                    >
                      <h3 className="mb-3 text-xl font-semibold text-indigo-500 lg:text-2xl">{item.title}</h3>
                      <p className="text-base font-light leading-relaxed text-gray-600 lg:text-lg">{item.description}</p>
                    </div>
                  )
                })}
              </div>

              <div className="mt-16 flex h-[14rem] items-center justify-center rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl lg:mt-0 lg:h-auto lg:p-12">
                <img
                  className="w-full object-contain"
                  src={detail[activeIndex].img}
                  alt={`Qwerty Learner ${detail[activeIndex].title} - feature screenshot`}
                />
              </div>
            </div>

            {/* Detailed feature list */}
            <div className="mt-16 lg:mt-24">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Phonetics and pronunciation */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-8">
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-indigo-100 p-3">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 sm:text-xl">Phonetics and pronunciation</h3>
                  <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                    Learn how a word sounds and its phonetic transcription while memorizing it. Standard American pronunciation helps you
                    build correct sound memory and improve listening and speaking.
                  </p>
                </div>

                {/* Dictation mode */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-8">
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-indigo-100 p-3">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 sm:text-xl">Smart dictation mode</h3>
                  <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                    After you finish a chapter you can choose to dictate it, reinforcing the words you just learned. Dictation practice
                    strengthens retention.
                  </p>
                </div>

                {/* Speed stats */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-8">
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-indigo-100 p-3">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 sm:text-xl">Accurate statistics</h3>
                  <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                    Measures your typing speed and accuracy so you can see your skills improve. Includes WPM stats, accuracy analysis and
                    progress tracking.
                  </p>
                </div>

                {/* Muscle memory */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-8">
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-indigo-100 p-3">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 sm:text-xl">English muscle memory training</h3>
                  <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                    Designed for keyboard workers: combines English vocabulary memorization with typing muscle memory, so you sharpen your
                    typing while learning words.
                  </p>
                </div>

                {/* Error correction */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-8">
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-indigo-100 p-3">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 sm:text-xl">Smart error correction</h3>
                  <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                    To avoid building wrong muscle memory, a mistyped word must be typed again from the start, keeping your muscle memory
                    and spelling habits correct.
                  </p>
                </div>

                {/* Multi-platform support */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-8">
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-indigo-100 p-3">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 sm:text-xl">Seamless across platforms</h3>
                  <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                    Available on the web and as a VSCode extension, so you can practice anywhere. Easy self-hosting options are also
                    provided for different needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Word list showcase */}
        <section className="mt-24 px-6 py-24 lg:mt-32 lg:px-24" itemScope itemType="https://schema.org/EducationalOrganization">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl xl:text-6xl">
                Rich word lists <span className="text-indigo-500">for everyone</span>
              </h2>
              <p className="mx-auto max-w-3xl text-xl font-light leading-relaxed text-gray-600">
                Covering CET-4/6, IELTS, TOEFL, GRE, Chinese postgraduate entrance exam English, Business English (BEC), and
                JavaScript/Java/Python technical word lists tailored for programmers, for all kinds of English learners
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Exam word lists */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-8">
                <div className="mb-6 inline-flex items-center justify-center rounded-full bg-red-100 p-3">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">Essential exam word lists</h3>
                <div className="space-y-2 text-xs text-gray-600 sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>CET-4 College English Test Band 4</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>CET-6 College English Test Band 6</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>TOEFL vocabulary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>IELTS vocabulary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>GRE Graduate Record Examination</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>GMAT business school admission test</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>SAT Scholastic Assessment Test</span>
                  </div>
                </div>
              </div>

              {/* Academic word lists */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-8">
                <div className="mb-6 inline-flex items-center justify-center rounded-full bg-blue-100 p-3">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">Academic word lists</h3>
                <div className="space-y-2 text-xs text-gray-600 sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>Postgraduate entrance exam core vocabulary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>TEM-4 Test for English Majors Band 4</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>TEM-8 Test for English Majors Band 8</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>Gaokao essential vocabulary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>Zhongkao key vocabulary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>PEP English textbooks, grades 3-9</span>
                  </div>
                </div>
              </div>

              {/* Business and languages */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-8">
                <div className="mb-6 inline-flex items-center justify-center rounded-full bg-green-100 p-3">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8"
                    />
                  </svg>
                </div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">Business and other languages</h3>
                <div className="space-y-2 text-xs text-gray-600 sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>Business English core vocabulary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>BEC Business English Certificate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>Wang Lu IELTS listening corpus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>Common Japanese words N1-N5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>3000 basic Kazakh words</span>
                  </div>
                </div>
              </div>

              {/* For programmers */}
              <div className="col-span-full rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 shadow-lg sm:p-8">
                <div className="mb-8 text-center">
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-indigo-100 p-4">
                    <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">Word lists and APIs for programmers</h3>
                  <p className="mx-auto max-w-3xl text-gray-600">
                    Technical vocabulary and programming API practice tailored for programmers, to code faster and improve your technical
                    English
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  <div className="text-center">
                    <div className="mb-2 text-sm font-semibold text-gray-900 sm:text-base">Programming vocabulary</div>
                    <div className="text-xs text-gray-600 sm:text-sm">
                      Coder Dict
                      <br />
                      Common programmer words
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 text-sm font-semibold text-gray-900 sm:text-base">JavaScript</div>
                    <div className="text-xs text-gray-600 sm:text-sm">
                      JS API
                      <br />
                      Core method practice
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 text-sm font-semibold text-gray-900 sm:text-base">Node.js</div>
                    <div className="text-xs text-gray-600 sm:text-sm">
                      Node API
                      <br />
                      Server-side development
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 text-sm font-semibold text-gray-900 sm:text-base">Java</div>
                    <div className="text-xs text-gray-600 sm:text-sm">
                      Java API
                      <br />
                      Enterprise development
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 text-sm font-semibold text-gray-900 sm:text-base">Linux</div>
                    <div className="text-xs text-gray-600 sm:text-sm">
                      Command-line commands
                      <br />
                      System administration
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-6 py-2 text-sm font-medium text-indigo-600">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    More programming language APIs coming
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <div className="mb-8">
                <h4 className="mb-4 text-2xl font-bold text-gray-900">Built by the community, always growing</h4>
                <p className="mx-auto max-w-2xl text-gray-600">
                  Our word lists are contributed and maintained by an active open-source community. Need a specific word list? Open an issue
                  on GitHub
                </p>
              </div>
              <a
                href="https://qwerty.kaiyi.cool/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg"
              >
                <span>Explore the word lists</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Programmer section */}
        <section
          className="mt-24 bg-gradient-to-br from-slate-900 via-gray-900 to-black px-6 py-24 lg:mt-32 lg:px-24"
          itemScope
          itemType="https://schema.org/SoftwareSourceCode"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-indigo-100 px-6 py-3 text-indigo-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span className="font-semibold">For Coder</span>
              </div>
              <h2 className="mb-6 text-4xl font-bold tracking-tight text-white lg:text-5xl xl:text-6xl">
                Tailored for <span className="text-indigo-400">programmers</span>
              </h2>
              <p className="mx-auto max-w-3xl text-xl font-light leading-relaxed text-gray-300">
                Built-in word lists of technical English programmers use every day, covering algorithms, data structures, design patterns,
                cloud computing and more, to improve your English typing speed. Also supports API practice for JavaScript, Node.js, Java,
                Python, Linux commands and more, helping programmers quickly get familiar with common APIs
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left: technical vocabulary */}
              <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm sm:p-8">
                <div className="mb-6 flex items-center gap-4">
                  <div className="rounded-full bg-indigo-600 p-3">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white sm:text-2xl">Technical vocabulary</h3>
                </div>
                <p className="mb-6 text-sm leading-relaxed text-gray-300 sm:text-base">
                  A collection of the English words programmers use most, with core vocabulary from algorithms, data structures, design
                  patterns, software engineering and more
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-lg bg-gray-700/50 p-3">
                    <span className="text-indigo-400">•</span>
                    <span className="text-gray-200">Algorithms and data structures</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-gray-700/50 p-3">
                    <span className="text-indigo-400">•</span>
                    <span className="text-gray-200">Software architecture and design patterns</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-gray-700/50 p-3">
                    <span className="text-indigo-400">•</span>
                    <span className="text-gray-200">Project management and collaboration tools</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-gray-700/50 p-3">
                    <span className="text-indigo-400">•</span>
                    <span className="text-gray-200">Cloud computing and DevOps terms</span>
                  </div>
                </div>
              </div>

              {/* Right: API practice */}
              <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm sm:p-8">
                <div className="mb-6 flex items-center gap-4">
                  <div className="rounded-full bg-green-600 p-3">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white sm:text-2xl">API method practice</h3>
                </div>
                <p className="mb-6 text-sm leading-relaxed text-gray-300 sm:text-base">
                  API practice for many popular programming languages: get familiar with common methods by typing them, improving coding
                  speed and API recall
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
                    <div className="mb-2 font-semibold text-yellow-400">JavaScript</div>
                    <div className="text-sm text-gray-300">Core APIs like Array, Object and Promise</div>
                  </div>
                  <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                    <div className="mb-2 font-semibold text-green-400">Node.js</div>
                    <div className="text-sm text-gray-300">Server-side APIs like fs, http and express</div>
                  </div>
                  <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-4">
                    <div className="mb-2 font-semibold text-orange-400">Java</div>
                    <div className="text-sm text-gray-300">Enterprise APIs like Collection and Stream</div>
                  </div>
                  <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                    <div className="mb-2 font-semibold text-blue-400">Linux</div>
                    <div className="text-sm text-gray-300">Common commands and system administration</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature highlights */}
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-indigo-600/20 p-4">
                  <svg className="h-8 w-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="mb-3 text-xl font-semibold text-white">Learn APIs fast</h4>
                <p className="text-gray-300">Memorize programming APIs quickly through typing practice and develop faster</p>
              </div>
              <div className="text-center">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-green-600/20 p-4">
                  <svg className="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h4 className="mb-3 text-xl font-semibold text-white">Better technical English</h4>
                <p className="text-gray-300">Technical vocabulary training to read docs and communicate better</p>
              </div>
              <div className="text-center">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-purple-600/20 p-4">
                  <svg className="h-8 w-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h4 className="mb-3 text-xl font-semibold text-white">VSCode extension</h4>
                <p className="text-gray-300">Practice right inside your development environment with the VSCode extension</p>
              </div>
            </div>

            <div className="mt-16 text-center">
              <div className="mb-8">
                <h4 className="mb-4 text-2xl font-bold text-white">Community-driven, continuously updated</h4>
                <p className="mx-auto max-w-2xl text-gray-300">
                  Our API word lists rely mainly on community contributions. APIs for more languages are being added - contributions are
                  welcome
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <a
                  href="https://qwerty.kaiyi.cool/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg"
                >
                  <span>Try the programmer features</span>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a
                  href="https://marketplace.visualstudio.com/items?itemName=Kaiyi.qwerty-learner"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-600 bg-gray-800 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-gray-700"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
                  </svg>
                  <span>Install the VSCode extension</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements section */}
        <section
          className="mt-24 bg-gradient-to-br from-gray-50 to-white px-6 py-24 lg:mt-32 lg:px-24"
          itemScope
          itemType="https://schema.org/Organization"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-yellow-100 px-6 py-3 text-yellow-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                <span className="font-semibold">Achievements</span>
              </div>
              <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl xl:text-6xl">
                A widely <span className="text-indigo-500">recognized</span> project
              </h2>
              <p className="mx-auto max-w-3xl text-xl font-light leading-relaxed text-gray-600">
                Ranked #1 on GitHub Trending, a top trending topic on V2EX, a Gitee GVP (Most Valuable Project), featured on the SSPAI
                homepage and more, making it the go-to free English learning app for 100,000+ users
              </p>
            </div>

            {/* Main achievements */}
            <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6 text-center shadow-lg sm:p-8">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-orange-100 p-4">
                  <svg className="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl">GitHub Trending</h3>
                <p className="text-sm text-gray-600 sm:text-base">#1 on global Trending</p>
              </div>

              <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-lg">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-red-100 p-4">
                  <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl">V2EX trending</h3>
                <p className="text-sm text-gray-600 sm:text-base">Site-wide trending project on V2EX</p>
              </div>

              <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center shadow-lg">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-green-100 p-4">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl">Gitee GVP</h3>
                <p className="text-sm text-gray-600 sm:text-base">Most Valuable open-source Project</p>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-8 text-center shadow-lg">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-blue-100 p-4">
                  <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl">Featured on SSPAI</h3>
                <p className="text-sm text-gray-600 sm:text-base">Featured app on the SSPAI homepage</p>
              </div>
            </div>

            {/* Detailed achievements */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
                <h3 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">Open-source recognition</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 sm:gap-4 sm:p-4">
                    <div className="flex-shrink-0 rounded-full bg-orange-100 p-2">
                      <svg className="h-5 w-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">#1 on GitHub global Trending</div>
                      <div className="text-sm text-gray-600">Top attention from developers worldwide</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 sm:gap-4 sm:p-4">
                    <div className="flex-shrink-0 rounded-full bg-green-100 p-2">
                      <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Gitee Most Valuable Project (GVP)</div>
                      <div className="text-sm text-gray-600">Certification for top open-source projects in China</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 sm:gap-4 sm:p-4">
                    <div className="flex-shrink-0 rounded-full bg-purple-100 p-2">
                      <svg className="h-5 w-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">GitCode G-Star program graduate</div>
                      <div className="text-sm text-gray-600">Outstanding project in the open-source G-Star program</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
                <h3 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">Media features</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 sm:gap-4 sm:p-4">
                    <div className="flex-shrink-0 rounded-full bg-red-100 p-2">
                      <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Site-wide trending project on V2EX</div>
                      <div className="text-sm text-gray-600">Widely discussed in the tech community</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 sm:gap-4 sm:p-4">
                    <div className="flex-shrink-0 rounded-full bg-blue-100 p-2">
                      <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Featured on the SSPAI homepage</div>
                      <div className="text-sm text-gray-600">Recognized by a curated app review platform</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 sm:gap-4 sm:p-4">
                    <div className="flex-shrink-0 rounded-full bg-gray-100 p-2">
                      <svg className="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Site-wide recommended project on Gitee</div>
                      <div className="text-sm text-gray-600">Recommended by a leading Chinese code hosting platform</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User stats */}
            <div className="mt-16 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 text-center sm:p-8">
              <h3 className="mb-6 text-xl font-bold text-gray-900 sm:mb-8 sm:text-2xl">Trusted by users - the numbers speak</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
                <div>
                  <div className="mb-2 text-3xl font-bold text-indigo-600 sm:text-4xl">20000+</div>
                  <div className="text-sm text-gray-600 sm:text-base">GitHub Stars</div>
                  <div className="text-xs text-gray-500 sm:text-sm">Widely recognized by developers</div>
                </div>
                <div>
                  <div className="mb-2 text-3xl font-bold text-indigo-600 sm:text-4xl">100000+</div>
                  <div className="text-sm text-gray-600 sm:text-base">Monthly active users</div>
                  <div className="text-xs text-gray-500 sm:text-sm">Learners who keep coming back</div>
                </div>
                <div>
                  <div className="mb-2 text-3xl font-bold text-indigo-600 sm:text-4xl">100+</div>
                  <div className="text-sm text-gray-600 sm:text-base">Community contributors</div>
                  <div className="text-xs text-gray-500 sm:text-sm">Improving the project together</div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center sm:mt-16">
              <div className="mb-8">
                <h4 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">Join our users</h4>
                <p className="mx-auto max-w-2xl text-sm text-gray-600 sm:text-base">
                  Join tens of thousands of users and try this widely recognized English learning tool to improve your typing and your
                  English
                </p>
              </div>
              <a
                href="https://qwerty.kaiyi.cool/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg"
              >
                <span>Join now</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        <section className="relative mt-24 w-full overflow-hidden py-24 lg:mt-32 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
          <div className="absolute inset-0">
            <div className="absolute -left-4 top-0 h-96 w-96 animate-pulse rounded-full bg-white/5 opacity-50 mix-blend-multiply blur-3xl filter"></div>
            <div
              className="absolute -right-4 top-0 h-96 w-96 animate-pulse rounded-full bg-white/5 opacity-50 mix-blend-multiply blur-3xl filter"
              style={{ animationDelay: '2s' }}
            ></div>
            <div
              className="absolute -bottom-8 left-20 h-96 w-96 animate-pulse rounded-full bg-white/5 opacity-50 mix-blend-multiply blur-3xl filter"
              style={{ animationDelay: '4s' }}
            ></div>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center">
            <h2 className="mb-8 text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl xl:text-7xl">
              Start <span className="text-indigo-300">now</span>
            </h2>
            <p className="mb-12 max-w-4xl text-xl font-light leading-relaxed text-white/80 lg:text-2xl">
              Begin your English learning journey and make every keystroke count
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <a
                href="https://qwerty.kaiyi.cool/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:shadow-3xl group relative overflow-hidden rounded-full bg-white px-12 py-5 text-xl font-semibold text-gray-900 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
              >
                <span className="relative z-10">Start learning →</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </a>
              <div className="flex items-center gap-2 text-sm font-light text-white/60 lg:hidden">
                <span>Best viewed in a desktop browser</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default MobilePage
