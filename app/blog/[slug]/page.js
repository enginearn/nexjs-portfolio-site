import fs from "fs"
import path from "path"
import matter from "gray-matter"
import ReactMarkdown from "react-markdown"

async function getSinglePost(context) {
    const { slug } = context.params
    const data = await import(`../../../data/${slug}.md`)
    const singleDocument = matter(data.default)
    // console.log(singleDocument)

    return {
        singleDocument: singleDocument
    }
}

const SingleBlog = async (props) => {
    const { singleDocument } = await getSinglePost(props)
    // console.log(singleDocument)
    return (
        <div>
            <h1>{singleDocument.data.title}</h1>
            <p>{singleDocument.data.date}</p>
            <ReactMarkdown>{singleDocument.content}</ReactMarkdown>
        </div>
    )
}

export default SingleBlog

export async function generateStaticParams() {
    async function getAllPosts() {
        const files = fs.readdirSync(path.join("data"))
        // console.log(files)
        const blogs = files.map((fileName) => {
            const slug = fileName.replace(".md", "")
            const fileData = fs.readFileSync(path.join("data", fileName), "utf-8")
            // console.log(fileData)
            const { data } = matter(fileData)
            // console.log(`data ${data}`)
            return {
                frontmatter: data,
                slug: slug
            }
        })
    
        return {
            blogs: blogs
        }
    }

    const { blogs } = await getAllPosts()

    const paths = blogs.map((blog) => `/${blog.slug}`)
    return paths
}