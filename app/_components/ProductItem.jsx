import Image from 'next/image'
import React, { useState } from 'react'

// (Fungsi resolveImageUrl tetap sama)
const resolveImageUrl = (product, backendBase) => {
  if (!product) return null

  const candidates = [
    product?.attributes?.image?.data?.[0]?.attributes?.formats?.thumbnail?.url,
    product?.attributes?.image?.data?.[0]?.attributes?.formats?.small?.url,
    product?.attributes?.image?.data?.[0]?.attributes?.url,
    product?.image?.[0]?.formats?.thumbnail?.url,
    product?.image?.[0]?.url,
    product?.image?.url,
    product?.attributes?.thumbnail?.data?.attributes?.url,
  ]

  const first = candidates.find(Boolean)
  if (!first) return null
  if (first.startsWith('http')) return first

  const base = backendBase ? backendBase.replace(/\/+$/, '') : ''
  const path = first.startsWith('/') ? first : `/${first}`
  return base ? `${base}${path}` : path
}


const ProductItem = ({product}) => {
  const [imageError, setImageError] = useState(false)

  const backend = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || ''
  const resolved = !imageError ? resolveImageUrl(product, backend) : null
  const fallback = '/no-image.png' 
  const finalImage = resolved || fallback

  const name = product?.attributes?.name ?? product?.name ?? 'Unnamed product'
  const priceValue = product?.attributes?.price ?? product?.price ?? null
  const price = priceValue !== null && priceValue !== undefined
    ? `Rp ${Number(priceValue).toLocaleString('id-ID')}`
    : ''

  return (
    <div className="flex flex-col items-start text-[#ffff] p-2 border border-gray-200 rounded-3xl hover:shadow-lg transition-shadow duration-300 w-full bg-[#382a25]">
      <div className="w-full mb-1 mt-2 px-2"> 
        <h3 className="font-bold text-lg line-clamp-2 font-saira" title={name}>{name}</h3>
      </div>

      <div className="relative w-full h-44 sm:h-48 md:h-56 lg:h-48 rounded-md overflow-hidden bg-[#382a25] flex items-center justify-center">
        <Image
          src={finalImage}
          alt={name}
          fill
          style={{ objectFit: 'contain', objectPosition: 'center' }}
          className="transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized={true}
          onError={() => setImageError(true)}
        />
      </div>

      <div className="w-full mt-3 mb-5 px-2">
        {price ? (
          <p className="font-bold text-xl text-white/90 font-miltonian">{price}</p> 
        ) : (
          <p className="text-gray-400 text-xs">Price not available</p>
        )}
      </div>
      
      
    </div>
  )
}

export default ProductItem
