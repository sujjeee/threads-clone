'use server'

import { db } from "@/server/db"
import { currentUser } from "@clerk/nextjs";
import { faker } from "@faker-js/faker"
import { NotificationType } from "@prisma/client";


export async function createFakeUsers() {
    const usersToCreate = [];

    for (let i = 1; i <= 100; i++) {
        const id = faker.string.nanoid(11);
        const username = faker.internet.userName();
        const fullname = faker.person.fullName()
        const email = faker.internet.email();
        const image = faker.image.avatarGitHub()
        const bio = faker.lorem.sentence();
        const link = faker.internet.url();

        usersToCreate.push({
            id,
            username,
            fullname,
            email,
            image,
            bio,
            link,
        });
    }

    const alldata = await db.user.createMany({
        data: usersToCreate,
    });

    return alldata
}

export async function getUsersId() {

    const alldata = await db.user.findMany({
        where: {
            verified: false
        },
        take: 50,
        select: {
            id: true
        }
    });

    return alldata.map(user => user.id)
}

export async function createFakePost() {
    const userIds = await getUsersId();

    const posts = [];
    for (let i = 0; i < userIds.length; i++) {
        const newPost = {
            authorId: userIds[i] as string,
            text: faker.lorem.sentence(),
        };

        posts.push(newPost);
    }

    await db.post.createMany({ data: posts });

    return { success: true }

}

export async function createFakeNotifications() {
    const user = await currentUser()
    const userIds = await getUsersId();

    const notifications = [];
    for (let i = 0; i < userIds.length; i++) {

        const newNotification = {
            type: NotificationType.LIKE,
            message: '"Your message here"',
            senderUserId: userIds[i] as string,
            receiverUserId: user?.id,
        };

        notifications.push(newNotification);
    }

    await db.notification.createMany({ data: notifications });

    return { success: true }

}

export async function deleteFakeUsers() {

    const alldata = await db.user.deleteMany({
        where: {
            verified: false
        }
    });

    return alldata
}



