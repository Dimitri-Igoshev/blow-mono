'use client'

import { PromoBgRightSlide } from "../components/PromoBgRightSlide"
import { PromoHeader } from "../components/PromoHeader"
import { PromoHero } from "../components/PromoHero"
import { PromoNext } from "../components/PromoNext"
import { profiles } from "../data/girls"

export default function PromoForMens() {
  return (
    <div className="min-h-screen w-full bg-black text-white relative overflow-hidden">
      <PromoBgRightSlide />
      <PromoHeader />
      <PromoHero />
      <PromoNext />
    </div>
  )
}