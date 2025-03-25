import CategoriesList from "@/components/features/categories/list/CategoriesList";
import StreamList from "@/components/features/stream/list/StreamList";
import { FindRandomCategoriesDocument, FindRandomCategoriesQuery, FindRandomStreamDocument, type FindRandomStreamQuery } from "@/graphql/gennerated/output";
import { SERVER_URL } from "@/libs/constants/url.constant";
import { getTranslations } from "next-intl/server";

const findRandomStreams = async () => {

  try {

    const query = FindRandomStreamDocument.loc?.source.body

    const res = await fetch(SERVER_URL!, {

      method: 'POST',
      headers: {

        'Content-Type': 'application/json'

      },
      body: JSON.stringify({ query }),
      next: {

        revalidate: 30

      }

    })

    const data = await res.json()

    return {

      streams: data.data.findRandomStream as FindRandomStreamQuery['findRandomStream']

    }

  } catch (error) {

    console.log(error)

    throw new Error('Error fetching streams')

  }

}

const findRandomCategories = async () => {

  try {

    const query = FindRandomCategoriesDocument.loc?.source.body

    const res = await fetch(SERVER_URL!, {

      method: 'POST',
      headers: {

        'Content-Type': 'application/json'

      },
      body: JSON.stringify({ query }),
      next: {

        revalidate: 30

      }

    })

    const data = await res.json()

    return {

      categories: data.data.findRandomCategories as FindRandomCategoriesQuery['findRandomCategories']

    }

  } catch (error) {

    console.log(error)

    throw new Error('Error fetching categories')

  }

}

export default async function HomePage() {

  const t = await getTranslations('')

  const { streams } = await findRandomStreams()

  const { categories } = await findRandomCategories()

  return (

    <>

      <div className="space-y-10">

        <StreamList heading={t('home.streamsHeading')} streams={streams} />

        <CategoriesList heading={t('categories.heading')} categories={categories} />

      </div>
    </>

  )

}
