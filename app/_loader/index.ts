console.log(`%c FuseBox HMR Custom Loader for development `, 'color: black; background: white;');

FuseBox.addPlugin({
  hmrUpdate: ({ type, path, content }: { type: string, path: string, content: string }) => {
    console.log(`%c Reloading: ${type} => ${path} `, 'color: blur;');
    if (type === 'js') {
      window.location.reload();
      return true;
    }
  }
});

export default 'LOADER';
