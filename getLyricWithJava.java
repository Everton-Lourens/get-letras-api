/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/GUIForms/JFrame.java to edit this template
 */
package pegarletra;

import java.awt.Toolkit;
import java.awt.datatransfer.Clipboard;
import java.awt.datatransfer.StringSelection;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.nio.file.Path;
import java.nio.file.Paths;
import javax.swing.JOptionPane;

/**
 *
 * @author EVERTON
 */
public class Home extends javax.swing.JFrame {

    static String pesquisar;
    static String titulo;
    static String artista;
    static String letra;
    static String arquivoOriginal;

    public Home() {
        initComponents();
    }

    public void postQuery(String query) {
        this.pesquisar = query;
        System.out.println("Pesquisar: " + pesquisar);

        String nomeArquivo = Paths.get("").toAbsolutePath() + "/src/meuNode/query.txt";
        String texto = pesquisar;

        try {
            FileWriter fileWriter = new FileWriter(nomeArquivo);
            fileWriter.write(texto);
            fileWriter.close();
            System.out.println("Texto gravado com sucesso no arquivo.");
        } catch (IOException e) {
            System.out.println("Erro ao gravar o arquivo: " + e.getMessage());
        }
    }

    public String letArquivoNode() {

        String diretorioAtual = System.getProperty("user.dir");
        String filePath = diretorioAtual + "\\src\\meuNode\\index.js";

        try {
            // Ler o conteúdo do arquivo
            BufferedReader reader = new BufferedReader(new FileReader(filePath));
            StringBuilder stringBuilder = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                stringBuilder.append(line);
                stringBuilder.append(System.lineSeparator());
            }
            reader.close();
            return stringBuilder.toString();

        } catch (IOException e) {
            System.out.println("Erro ao editar o arquivo: " + e.getMessage());
        }
        return null;
    }

    public void writer(String conteudo) {
        try {
            String diretorioAtual = System.getProperty("user.dir");
            String filePath = diretorioAtual + "\\src\\meuNode\\index.js";
            // Editar o conteúdo

            this.arquivoOriginal = conteudo;
            String novoConteudo = editarConteudoJS(conteudo); // Função para editar o conteúdo do arquivo

            // Salvar as alterações de volta no arquivo
            BufferedWriter writer = new BufferedWriter(new FileWriter(filePath));
            writer.write(novoConteudo);
            writer.close();

            System.out.println("Arquivo editado com sucesso.");
        } catch (IOException e) {
            System.out.println("Erro ao editar o arquivo: " + e.getMessage());
        }
    }

    public void defaultConfig() {
        this.pesquisar = "PESQUISAR";
        writer(arquivoOriginal);
    }

    private static String editarConteudoJS(String conteudo) {
        // Faça as alterações desejadas no conteúdo do arquivo JavaScript
        // Por exemplo, você pode substituir uma string por outra
        String novoConteudo = conteudo.replace("let query = 'PESQUISAR';", "let query = '" + pesquisar + "';");
        return novoConteudo;
    }

    public void promtNode() {
        try {
            // Obter o diretório atual em que o programa está sendo executado
            String diretorioAtual = System.getProperty("user.dir");
            // Criar um objeto ProcessBuilder para executar o Node.js
            ProcessBuilder pb = new ProcessBuilder("node", diretorioAtual + "\\src\\meuNode\\index.js");
            // Definir o diretório de trabalho do processo como o diretório atual
            pb.directory(new File(diretorioAtual));
            // Iniciar o processo
            Process processo = pb.start();
            // Ler a saída do processo
            BufferedReader reader = new BufferedReader(new InputStreamReader(processo.getInputStream()));

            BufferedReader errorReader = new BufferedReader(new InputStreamReader(processo.getErrorStream()));
            String errorLine;
            while ((errorLine = errorReader.readLine()) != null) {
                System.err.println(errorLine);
            }

            String linha;
            String teste = "";
            int count = 0;
            while ((linha = reader.readLine()) != null) {
                System.out.println(linha);
                if (count == 0) {
                    txtTitulo.setText(linha);
                } else if (count == 1) {
                    txtArtista.setText(linha);
                } else {
                    teste = teste + linha + "\n";
                }
                count++;
            }
            txtLetra.setText(teste);
            txtPesquisar.setText(null);

            // Esperar pelo término do processo
            processo.waitFor();
            // Imprimir a saída do processo
            System.out.println("Saída do processo: " + processo.exitValue());
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">                          
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        jPanel2 = new javax.swing.JPanel();
        txtPesquisar = new javax.swing.JTextField();
        jButton1 = new javax.swing.JButton();
        jPanel3 = new javax.swing.JPanel();
        btCopiarTitulo = new javax.swing.JButton();
        txtTitulo = new javax.swing.JTextField();
        jPanel4 = new javax.swing.JPanel();
        btCopiarArtista = new javax.swing.JButton();
        txtArtista = new javax.swing.JTextField();
        jPanel5 = new javax.swing.JPanel();
        btCopiarLetra = new javax.swing.JButton();
        jScrollPane1 = new javax.swing.JScrollPane();
        txtLetra = new javax.swing.JTextArea();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);

        jButton1.setText("Pesquisar");
        jButton1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton1ActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 113, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(txtPesquisar, javax.swing.GroupLayout.PREFERRED_SIZE, 555, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(txtPesquisar, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jButton1))
                .addContainerGap(12, Short.MAX_VALUE))
        );

        btCopiarTitulo.setText("Copiar Título");
        btCopiarTitulo.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btCopiarTituloActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel3Layout = new javax.swing.GroupLayout(jPanel3);
        jPanel3.setLayout(jPanel3Layout);
        jPanel3Layout.setHorizontalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(btCopiarTitulo, javax.swing.GroupLayout.PREFERRED_SIZE, 113, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(txtTitulo, javax.swing.GroupLayout.PREFERRED_SIZE, 555, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel3Layout.setVerticalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel3Layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(btCopiarTitulo)
                    .addComponent(txtTitulo, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap())
        );

        btCopiarArtista.setText("Copiar Artista");
        btCopiarArtista.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btCopiarArtistaActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel4Layout = new javax.swing.GroupLayout(jPanel4);
        jPanel4.setLayout(jPanel4Layout);
        jPanel4Layout.setHorizontalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel4Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(btCopiarArtista, javax.swing.GroupLayout.PREFERRED_SIZE, 113, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(txtArtista, javax.swing.GroupLayout.PREFERRED_SIZE, 555, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel4Layout.setVerticalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel4Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(btCopiarArtista)
                    .addComponent(txtArtista, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(18, Short.MAX_VALUE))
        );

        btCopiarLetra.setText("Copiar Letra");
        btCopiarLetra.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btCopiarLetraActionPerformed(evt);
            }
        });

        txtLetra.setColumns(20);
        txtLetra.setRows(5);
        jScrollPane1.setViewportView(txtLetra);

        javax.swing.GroupLayout jPanel5Layout = new javax.swing.GroupLayout(jPanel5);
        jPanel5.setLayout(jPanel5Layout);
        jPanel5Layout.setHorizontalGroup(
            jPanel5Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel5Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(btCopiarLetra, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGap(18, 18, 18)
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 555, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap())
        );
        jPanel5Layout.setVerticalGroup(
            jPanel5Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel5Layout.createSequentialGroup()
                .addComponent(btCopiarLetra)
                .addGap(0, 0, Short.MAX_VALUE))
            .addComponent(jScrollPane1, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, 296, Short.MAX_VALUE)
        );

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jPanel3, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jPanel2, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jPanel4, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jPanel5, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addContainerGap())
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(25, 25, 25)
                .addComponent(jPanel3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel4, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel5, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGap(14, 14, 14))
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );

        pack();
        setLocationRelativeTo(null);
    }// </editor-fold>                        

    private void jButton1ActionPerformed(java.awt.event.ActionEvent evt) {                                         
        // TODO add your handling code here:

        if (txtPesquisar.getText().length() == 0) {
            JOptionPane.showMessageDialog(null, "Aviso: Digite algo para pesquisar.", "Aviso", JOptionPane.WARNING_MESSAGE);
        } else {
            //postQuery(txtPesquisar.getText());
            this.pesquisar = txtPesquisar.getText();
            System.out.println("Pesquisar: " + pesquisar);
            writer(letArquivoNode());

            promtNode();

            Thread nodeThread = new Thread(() -> {
                carregar();
            });
            nodeThread.start();

            defaultConfig();

        }

    }                                        

    public void carregar() {
        loading load = new loading();
        load.setVisible(true);
        try {

            for (int i = 0; i <= 100; i += 3) {
                Thread.sleep(100);
                load.progresso.setValue(i);
                //load.porcentagem.setText(Integer.toString(i)); // Não coloquei
                if (txtLetra.getText() != null) {
                    load.dispose();
                }
            }
            load.dispose();

        } catch (Exception e) {
        }

    }


    private void btCopiarTituloActionPerformed(java.awt.event.ActionEvent evt) {                                               
        System.out.println("Copiando Título");

        String textoParaCopiar = txtTitulo.getText();

        try {
            StringSelection selecao = new StringSelection(textoParaCopiar);

            Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();

            clipboard.setContents(selecao, null);

            System.out.println("Texto copiado com sucesso!");
        } catch (IllegalStateException ex) {
            System.out.println("Erro ao copiar o texto: " + ex.getMessage());
        }
    }                                              

    private void btCopiarArtistaActionPerformed(java.awt.event.ActionEvent evt) {                                                
        // TODO add your handling code here:
        System.out.println("Copiando Título");

        String textoParaCopiar = txtArtista.getText();

        try {
            StringSelection selecao = new StringSelection(textoParaCopiar);

            Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();

            clipboard.setContents(selecao, null);

            System.out.println("Texto copiado com sucesso!");
        } catch (IllegalStateException ex) {
            System.out.println("Erro ao copiar o texto: " + ex.getMessage());
        }
    }                                               

    private void btCopiarLetraActionPerformed(java.awt.event.ActionEvent evt) {                                              
        // TODO add your handling code here:
        System.out.println("Copiando Título");

        String textoParaCopiar = txtLetra.getText();

        try {
            StringSelection selecao = new StringSelection(textoParaCopiar);

            Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();

            clipboard.setContents(selecao, null);

            System.out.println("Texto copiado com sucesso!");
        } catch (IllegalStateException ex) {
            System.out.println("Erro ao copiar o texto: " + ex.getMessage());
        }
    }                                             

    /**
     * @param args the command line arguments
     */
    public static void main(String args[]) {
        /* Set the Nimbus look and feel */
        //<editor-fold defaultstate="collapsed" desc=" Look and feel setting code (optional) ">
        /* If Nimbus (introduced in Java SE 6) is not available, stay with the default look and feel.
         * For details see http://download.oracle.com/javase/tutorial/uiswing/lookandfeel/plaf.html 
         */
        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (ClassNotFoundException ex) {
            java.util.logging.Logger.getLogger(Home.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(Home.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(Home.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(Home.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new Home().setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify                     
    private javax.swing.JButton btCopiarArtista;
    private javax.swing.JButton btCopiarLetra;
    private javax.swing.JButton btCopiarTitulo;
    private javax.swing.JButton jButton1;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JPanel jPanel4;
    private javax.swing.JPanel jPanel5;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JTextField txtArtista;
    private javax.swing.JTextArea txtLetra;
    private javax.swing.JTextField txtPesquisar;
    private javax.swing.JTextField txtTitulo;
    // End of variables declaration                   
}
