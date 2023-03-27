interface LangKeys {
  AppTitle: string;
}

const Language = {
  en_AU: {
    AppTitle: 'Robot Party',
  } as LangKeys,
};

const GetTranslation = (lang: string, key: string) => {
  return (Language as any)[lang][key];
};

export {GetTranslation};
