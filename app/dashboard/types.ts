export interface Course {
  courseId: string;
  title: string;
  createdBy: string;
  description: string;
}

export interface UserData {
  id: string;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  emailAddress: string | null;
  imageUrl: string;
}
