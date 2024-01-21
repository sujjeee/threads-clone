"use server";

import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs";
import { faker } from "@faker-js/faker";
import { NotificationType } from "@prisma/client";

export async function checkAdmin() {
  const user = await currentUser();

  const res = await db.user.findUnique({
    where: {
      id: user?.id,
      isAdmin: true,
      verified: true,
    },
    select: {
      username: true,
    },
  });

  if (!res) return { success: false };

  return { success: true };
}

export async function createFakeUsers() {
  const isAdmin = await checkAdmin();

  if (!isAdmin) return null;

  const usersToCreate = [];

  for (let i = 1; i <= 100; i++) {
    const id = faker.string.nanoid(11);
    const username = faker.internet.userName();
    const fullname = faker.person.fullName();
    const email = faker.internet.email();
    const image = faker.image.avatarGitHub();
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

  return alldata;
}

export async function getUsersId() {
  const isAdmin = await checkAdmin();

  if (!isAdmin) return null;

  const alldata = await db.user.findMany({
    where: {
      verified: false,
    },
    take: 50,
    select: {
      id: true,
    },
  });

  return alldata.map((user) => user.id);
}

export async function createFakePost() {
  const isAdmin = await checkAdmin();

  if (!isAdmin) return null;

  const userIds = await getUsersId();

  if (!userIds) {
    return { success: false, error: "User information not available." };
  }

  const posts = [];
  for (const userId of userIds) {
    const newPost = {
      authorId: userId,
      text: faker.lorem.sentence(),
    };

    posts.push(newPost);
  }

  await db.post.createMany({ data: posts });

  return { success: true };
}

export async function createFakeNotifications() {
  const isAdmin = await checkAdmin();

  if (!isAdmin) return null;

  const user = await currentUser();
  const userIds = await getUsersId();

  if (!userIds) {
    return { success: false, error: "User information not available." };
  }

  const notifications = [];
  for (const userId of userIds) {
    const newNotification = {
      type: NotificationType.LIKE,
      message: '"Your message here"',
      senderUserId: userId,
      receiverUserId: user?.id,
    };

    notifications.push(newNotification);
  }

  await db.notification.createMany({ data: notifications });

  return { success: true };
}

export async function deleteFakeUsers() {
  const isAdmin = await checkAdmin();

  if (!isAdmin) return null;

  const alldata = await db.user.deleteMany({
    where: {
      verified: false,
    },
  });

  return alldata;
}

// VERRRRRYYYYY DANGEROUS ☠️

// export async function renameUsernames() {
//   const isAdmin = await checkAdmin();

//   if (!isAdmin) return null;

//   const allUsers = await db.user.findMany({
//     select: {
//       id: true,
//       username: true,
//     },
//   });

//   const updatedUsernames = allUsers.map((user) => ({
//     id: user.id,
//     username: user.username + "_old",
//   }));
//   // return alldata.map(user => user.id)

//   await Promise.all(
//     updatedUsernames.map(async (updatedUser) => {
//       await db.user.update({
//         where: { id: updatedUser.id },
//         data: { username: updatedUser.username },
//       });
//     }),
//   );

//   return { success: true };
// }
