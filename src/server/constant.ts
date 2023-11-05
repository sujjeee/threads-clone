export const GET_USER = {
    id: true,
    image: true,
    fullname: true,
    username: true,
    bio: true,
    link: true,
    createdAt: true,
    isAdmin: true,
    followers: {
        select: {
            id: true,
            image: true
        }
    }
}

export const GET_COUNT = {
    _count: {
        select: {
            likes: true,
            replies: true
        }
    },
}
