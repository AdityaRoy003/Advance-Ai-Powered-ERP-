export const sendVerificationEmail = async (email: string): Promise<void> => {
  console.log(`Verification email would be sent to ${email}`);
};

export default { sendVerificationEmail };
