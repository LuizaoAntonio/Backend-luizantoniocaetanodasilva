

export default function CartaoTreino({ treino, onConcluir, onApagar }) {
  const concluido = Boolean(treino.concluido);


  return (
    <li className="item">
      <div className="item-info">
        <strong>{treino.nome}</strong>


        <span className="suave">
          {treino.duracao} min
        </span>


        {concluido && (
          <span className="selo feito">
            concluído
          </span>
        )}
      </div>


      <div className="acoes">
        {!concluido && (
          <button onClick={() => onConcluir(treino.id)}>
            Concluir
          </button>
        )}


        <button
          className="perigo"
          onClick={() => onApagar(treino.id)}
        >
          Apagar
        </button>
      </div>
    </li>
  );
}
