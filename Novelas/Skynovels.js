// 📦 Importa la librería de fetch usada en LNReader
const { fetchApi } = require("@libs/fetch");

class SkyNovels {
  constructor() {
      this.id = "skynovels";                     // Identificador interno
          this.name = "SkyNovels";                   // Nombre de la fuente
              this.site = "https://www.skynovels.net/";  // Sitio web principal
                  this.apiSite = "https://api.skynovels.net/api/"; // API base
                      this.version = "1.0.1";                    // Versión del conector
                          this.icon = "src/es/skynovels/icon.png";   // Ícono
                            }

                              // 🔹 Obtener novelas populares
                                async popularNovels() {
                                    const url = this.apiSite + "novels?&q";
                                        const res = await fetchApi(url);
                                            const data = await res.json();

                                                const novelas = [];
                                                    data.novels?.forEach(nvl => {
                                                          novelas.push({
                                                                  name: nvl.nvl_title,
                                                                          cover: this.apiSite + "get-image/" + nvl.image + "/novels/false",
                                                                                  path: "novelas/" + nvl.id + "/" + nvl.nvl_name + "/"
                                                                                        });
                                                                                            });

                                                                                                return novelas;
                                                                                                  }

                                                                                                    // 🔹 Parsear información de una novela
                                                                                                      async parseNovel(path) {
                                                                                                          const id = path.split("/")[1];
                                                                                                              const url = this.apiSite + "novel/" + id + "/reading?&q";
                                                                                                                  const res = await fetchApi(url);
                                                                                                                      const data = await res.json();

                                                                                                                          const novela = data?.novel?.[0];
                                                                                                                              const info = {
                                                                                                                                    path,
                                                                                                                                          name: novela?.nvl_title || "Sin título",
                                                                                                                                                cover: this.apiSite + "get-image/" + novela?.image + "/novels/false",
                                                                                                                                                      genres: novela?.genres?.map(g => g.genre_name).join(",") || "",
                                                                                                                                                            author: novela?.nvl_writer,
                                                                                                                                                                  summary: novela?.nvl_content,
                                                                                                                                                                        status: novela?.nvl_status,
                                                                                                                                                                              chapters: []
                                                                                                                                                                                  };

                                                                                                                                                                                      // 🔧 Extraer capítulos con nombre real
                                                                                                                                                                                          novela?.volumes?.forEach(vol => {
                                                                                                                                                                                                vol?.chapters?.forEach(chp => {
                                                                                                                                                                                                        info.chapters.push({
                                                                                                                                                                                                                  // Usa el nombre real del capítulo, y si no existe, usa el índice
                                                                                                                                                                                                                            name: chp.chp_name || chp.chp_index_title,
                                                                                                                                                                                                                                      releaseTime: new Date(chp.createdAt).toDateString(),
                                                                                                                                                                                                                                                path: path + chp.id + "/" + chp.chp_name
                                                                                                                                                                                                                                                        });
                                                                                                                                                                                                                                                              });
                                                                                                                                                                                                                                                                  });

                                                                                                                                                                                                                                                                      return info;
                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                          // 🔹 Parsear contenido de un capítulo
                                                                                                                                                                                                                                                                            async parseChapter(path) {
                                                                                                                                                                                                                                                                                const id = path.split("/")[3];
                                                                                                                                                                                                                                                                                    const url = this.apiSite + "novel-chapter/" + id;
                                                                                                                                                                                                                                                                                        const res = await fetchApi(url);
                                                                                                                                                                                                                                                                                            const data = await res.json();

                                                                                                                                                                                                                                                                                                const chapter = data?.chapter?.[0];
                                                                                                                                                                                                                                                                                                    return (chapter?.chp_content || "").replace(/\n/g, "<br>");
                                                                                                                                                                                                                                                                                                      }

                                                                                                                                                                                                                                                                                                        // 🔹 Buscar novelas por título
                                                                                                                                                                                                                                                                                                          async searchNovels(query) {
                                                                                                                                                                                                                                                                                                              query = query.toLowerCase();
                                                                                                                                                                                                                                                                                                                  const url = this.apiSite + "novels?&q";
                                                                                                                                                                                                                                                                                                                      const res = await fetchApi(url);
                                                                                                                                                                                                                                                                                                                          const data = await res.json();

                                                                                                                                                                                                                                                                                                                              const resultados = [];
                                                                                                                                                                                                                                                                                                                                  data?.novels
                                                                                                                                                                                                                                                                                                                                        ?.filter(nvl => nvl.nvl_title.toLowerCase().includes(query))
                                                                                                                                                                                                                                                                                                                                              .forEach(nvl => {
                                                                                                                                                                                                                                                                                                                                                      resultados.push({
                                                                                                                                                                                                                                                                                                                                                                name: nvl.nvl_title,
                                                                                                                                                                                                                                                                                                                                                                          cover: this.apiSite + "get-image/" + nvl.image + "/novels/false",
                                                                                                                                                                                                                                                                                                                                                                                    path: "novelas/" + nvl.id + "/" + nvl.nvl_name + "/"
                                                                                                                                                                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                                                                                                                                                                  });

                                                                                                                                                                                                                                                                                                                                                                                                      return resultados;
                                                                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                                                                        // 📤 Exporta el conector
                                                                                                                                                                                                                                                                                                                                                                                                        module.exports = new SkyNovels();
