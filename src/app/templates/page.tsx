import Image from 'next/image'
import Link from 'next/link'

const templates = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'A clean and professional template suitable for most industries.',
    image: '/templates/professional.png',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'A modern two-column design with a sleek color scheme.',
    image: '/templates/creative.png',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'A simple and elegant design that lets your content shine.',
    image: '/templates/minimal.png',
  },
]

export default function Templates() {
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Resume Templates</h1>
          <p className="mt-2 text-gray-600">
            Choose from our collection of professionally designed templates.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="relative group bg-white p-6 rounded-lg shadow-sm ring-1 ring-gray-900/5 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="aspect-[3/4] relative mb-4 rounded-lg bg-gray-100 overflow-hidden">
                <Image
                  src={template.image}
                  alt={template.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain hover:scale-105 transition-transform duration-200"
                  priority
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{template.description}</p>
              <Link
                href={`/create?template=${template.id}`}
                className="mt-4 block w-full text-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Use Template
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 