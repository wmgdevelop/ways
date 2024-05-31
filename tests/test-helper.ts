export async function wait(milliseconds: number) {
  await new Promise(resolve => setTimeout(resolve, milliseconds));
}

export async function waitBuildTemplate() {
  await wait(10);
}

