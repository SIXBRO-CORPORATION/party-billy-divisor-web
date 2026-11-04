import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import BillDetailsStep from '../components/bill/BillDetailsStep.tsx';
import BillItemsStep from '../components/bill/BillItemsStep.tsx';
import ConsumptionStep from '../components/bill/ConsumptionStep.tsx';
import type { ItemsMethod } from '../components/bill/ItemsMethodPicker.tsx';
import NewBillHeader from '../components/bill/NewBillHeader.tsx';
import PeopleStep from '../components/bill/PeopleStep.tsx';
import PersonForm from '../components/bill/PersonForm.tsx';
import PersonCard from '../components/bill/PersonCard.tsx';
import ProductCard from '../components/bill/ProductCard.tsx';
import ReceiptScanStep from '../components/bill/ReceiptScanStep.tsx';
import { ShareButton } from '../components/bill/ShareButton.tsx';
import SplitPreview from '../components/bill/SplitPreview.tsx';
import { Button } from '../components/ui/Button.tsx';
import { useAuth } from '../hooks/useAuth.ts';
import { useBillDraft } from '../hooks/useBillDraft.ts';
import { useBills, useCreateBill } from '../hooks/useBills.ts';
import { useReceiptScan } from '../hooks/useReceiptScan.ts';
import { useRecentCollaborators } from '../hooks/useRecentCollaborators.ts';
import { useToast } from '../hooks/useToast.ts';
import { buildSplitShareData } from '../utils/shareText.ts';
import {
    calculateBillSplit,
    capitalize,
    draftToCreateBillRequest,
    formatDayLabel,
    formatMoney,
    getBillPayer,
    todayISODate,
} from '../utils/utils.ts';

type Step = 'details' | 'scan' | 'items' | 'people' | 'consumption' | 'review';

interface ReceiptPhoto {
    url: string;
    name: string;
}

export default function NewBillPage() {
    const {
        draft,
        setTitle,
        setPlace,
        setDate,
        setPayerId,
        addPerson,
        updatePerson,
        removePerson,
        addProduct,
        addProducts,
        updateProduct,
        removeProduct,
        setProductParticipants,
        splitAllEqually,
        clearRelations,
        reset,
    } = useBillDraft();

    const { createBill, isCreating } = useCreateBill();
    const { bills } = useBills();
    const navigate = useNavigate();
    const toast = useToast();
    const { user } = useAuth();

    const [step, setStep] = useState<Step>('details');
    const [receipt, setReceipt] = useState<ReceiptPhoto | null>(null);
    const [scannedCount, setScannedCount] = useState<number | null>(null);
    const [method, setMethod] = useState<ItemsMethod>(() =>
        draft.products.length > 0 ? 'manual' : 'scan'
    );
    const [today] = useState(todayISODate);
    const [showTitleError, setShowTitleError] = useState(false);

    const titleInputRef = useRef<HTMLInputElement>(null);
    const scanInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            if (receipt) {
                URL.revokeObjectURL(receipt.url);
            }
        };
    }, [receipt]);

    const { isScanning, scan, cancel: cancelScan } = useReceiptScan((scanned) => {
        if (scanned.length === 0) {
            toast.error('Não consegui identificar itens nessa nota. Tente outra foto.');
            return;
        }

        addProducts(
            scanned.map((item) => ({
                name: item.name,
                unitPrice: Number(item.unit_price),
                quantity: item.quantity,
            }))
        );

        setScannedCount(scanned.length);
        setStep('items');
    });

    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    const { suggestions, isLoading: suggestionsLoading } = useRecentCollaborators(
        bills,
        draft.persons.map((person) => person.name)
    );

    const split = calculateBillSplit(draft);

    const userName = user?.name ?? user?.email ?? '';
    const date = draft.date || today;

    const canSave =
        draft.title.trim().length > 0 &&
        draft.products.length > 0 &&
        draft.persons.length > 0 &&
        split.success;

    function handleTitleChange(title: string) {
        setTitle(title);
        setShowTitleError(false);
    }

    function handleContinue() {
        if (draft.title.trim().length === 0) {
            setShowTitleError(true);
            titleInputRef.current?.focus();
            return;
        }

        if (method === 'scan') {
            scanInputRef.current?.click();
            return;
        }

        setScannedCount(null);
        setStep('items');
    }

    function handleScanFile(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        event.target.value = '';

        if (!file) {
            return;
        }

        setReceipt({ url: URL.createObjectURL(file), name: file.name });
        setStep('scan');
        void scan(file);
    }

    function handleScanManually() {
        cancelScan();
        setScannedCount(null);
        setStep('items');
    }

    function handleBackToDetails() {
        if (draft.products.length > 0) {
            setMethod('manual');
        }

        setStep('details');
    }

    function handleReset() {
        reset();
        setReceipt(null);
        setScannedCount(null);
    }

    async function handleSave() {
        if (!canSave) {
            toast.error('Falta um título e vincular pelo menos uma pessoa a cada item');
            return;
        }

        try {
            const bill = await createBill(draftToCreateBillRequest(draft));

            reset();
            navigate(`/bills/${bill.id}`, { replace: true });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Não foi possível salvar a conta');
        }
    }

    if (step !== 'review') {
        const itemsSubtitle =
            scannedCount === null
                ? 'Adicione, edite ou remova itens antes de continuar.'
                : `Lemos ${scannedCount} ${scannedCount === 1 ? 'item' : 'itens'} na nota. Corrija o que precisar antes de continuar.`;

        return (
            <div className="newbill">
                <input
                    ref={scanInputRef}
                    type="file"
                    accept="image/*"
                    className="visually-hidden"
                    onChange={handleScanFile}
                    aria-hidden="true"
                    tabIndex={-1}
                />

                {step === 'details' && (
                    <>
                        <NewBillHeader current={1} title="Nova conta" />

                        <BillDetailsStep
                            draft={draft}
                            date={date}
                            userName={userName}
                            method={method}
                            isBusy={isScanning}
                            titleError={
                                showTitleError && draft.title.trim().length === 0
                                    ? 'Dê um nome para a conta'
                                    : undefined
                            }
                            titleInputRef={titleInputRef}
                            onTitleChange={handleTitleChange}
                            onPlaceChange={setPlace}
                            onDateChange={setDate}
                            onPayerChange={setPayerId}
                            onMethodChange={setMethod}
                            onCancel={() => navigate('/')}
                            onContinue={handleContinue}
                        />
                    </>
                )}

                {step === 'scan' && receipt && (
                    <>
                        <NewBillHeader current={2} title="Escanear nota" trail="Itens" />

                        <ReceiptScanStep
                            imageUrl={receipt.url}
                            fileName={receipt.name}
                            status={isScanning ? 'reading' : 'failed'}
                            onPickAnother={() => scanInputRef.current?.click()}
                            onManual={handleScanManually}
                        />
                    </>
                )}

                {step === 'items' && (
                    <>
                        <NewBillHeader
                            current={2}
                            title="Confira os itens"
                            subtitle={itemsSubtitle}
                            trail="Itens"
                        />

                        <BillItemsStep
                            products={draft.products}
                            receiptUrl={receipt?.url ?? null}
                            onAddProduct={addProduct}
                            onUpdateProduct={updateProduct}
                            onRemoveProduct={removeProduct}
                            onBack={handleBackToDetails}
                            onContinue={() => setStep('people')}
                        />
                    </>
                )}

                {step === 'people' && (
                    <>
                        <NewBillHeader
                            current={3}
                            title="Quem tá na mesa?"
                            subtitle="Adicione todo mundo que vai dividir a conta."
                            trail="Pessoas"
                        />

                        <PeopleStep
                            persons={draft.persons}
                            payerId={draft.payerId}
                            products={draft.products}
                            suggestions={suggestions}
                            suggestionsLoading={suggestionsLoading}
                            onAddPerson={addPerson}
                            onUpdatePerson={updatePerson}
                            onRemovePerson={removePerson}
                            onBack={() => setStep('items')}
                            onContinue={() => setStep('consumption')}
                        />
                    </>
                )}

                {step === 'consumption' && (
                    <>
                        <NewBillHeader
                            current={4}
                            title="Quem consumiu o quê?"
                            subtitle="Clique nas pessoas de cada item. Os valores se ajustam na hora."
                            trail="Consumo"
                        />

                        <ConsumptionStep
                            persons={draft.persons}
                            products={draft.products}
                            relations={draft.relations}
                            onSetProductParticipants={setProductParticipants}
                            onSplitAll={splitAllEqually}
                            onClear={clearRelations}
                            onBack={() => setStep('people')}
                            onContinue={() => setStep('review')}
                        />
                    </>
                )}
            </div>
        );
    }

    const payer = getBillPayer(draft, userName);
    const summary = [draft.place.trim(), capitalize(formatDayLabel(date)), `Pagou: ${payer.name}`]
        .filter(Boolean)
        .join(' · ');

    return (
        <div className="page has-save-bar">
            <div className="page-header">
                <div>
                    <h1>Nova conta</h1>
                    <p className="page-subtitle">
                        Escaneie a nota ou cadastre na mão, junte a galera e defina quem ficou com o quê.
                    </p>
                </div>

                <div className="page-header-actions hide-on-mobile">
                    <Button variant="ghost" onClick={handleReset} disabled={isCreating}>
                        Limpar
                    </Button>

                    <Button size="lg" onClick={handleSave} loading={isCreating} disabled={!canSave}>
                        Salvar conta
                    </Button>
                </div>
            </div>

            <section className="panel bill-summary">
                <div className="bill-summary-info">
                    <strong>{draft.title.trim()}</strong>
                    <span>{summary}</span>
                </div>

                <div className="bill-summary-actions">
                    <Button variant="outline" size="sm" onClick={() => setStep('details')}>
                        Editar detalhes
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => setStep('items')}>
                        Editar itens
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => setStep('people')}>
                        Editar pessoas
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => setStep('consumption')}>
                        Editar consumo
                    </Button>
                </div>
            </section>

            <section className="panel">
                <div className="panel-header-row">
                    <div className="panel-title">
                        <span className="step-badge">1</span>
                        <span>Itens da conta</span>
                    </div>
                </div>

                <div className="card-list">
                    {draft.products.length === 0 && (
                        <p className="panel-empty">
                            Nenhum item ainda. Use “Editar itens” para adicionar.
                        </p>
                    )}

                    {draft.products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            persons={draft.persons}
                            relations={draft.relations}
                            isAddingPeople={selectedProductId === product.id}
                            onToggleAddPeople={(productId) =>
                                setSelectedProductId((current) =>
                                    current === productId ? null : productId
                                )
                            }
                            onCloseAddPeople={() => setSelectedProductId(null)}
                            onConfirmParticipants={setProductParticipants}
                            onRemove={removeProduct}
                        />
                    ))}
                </div>
            </section>

            <section className="panel">
                <div className="panel-title">
                    <span className="step-badge">2</span>
                    <span>Quem estava junto</span>
                </div>

                <PersonForm onAddPerson={addPerson} />

                <div className="card-list">
                    {draft.persons.length === 0 && (
                        <p className="panel-empty">Ninguém cadastrado ainda.</p>
                    )}

                    {draft.persons.map((person) => (
                        <PersonCard
                            key={person.id}
                            person={person}
                            products={draft.products}
                            relations={draft.relations}
                            onRemove={removePerson}
                        />
                    ))}
                </div>
            </section>

            {draft.products.length > 0 && (
                <section className="panel">
                    <div className="panel-header-row">
                        <div className="panel-title">
                            <span className="step-badge">3</span>
                            <span>Prévia da divisão</span>
                        </div>

                        {split.success && (
                            <ShareButton
                                data={buildSplitShareData(draft.title, split)}
                                variant="ghost"
                                size="sm"
                            />
                        )}
                    </div>

                    <SplitPreview result={split} />
                </section>
            )}

            <div className="save-bar">
                <div className="save-bar-info">
                    <span>Total</span>
                    <strong>R$ {split.success ? formatMoney(split.totalBill) : '0,00'}</strong>
                </div>

                <div className="save-bar-actions">
                    <Button variant="ghost" onClick={handleReset} disabled={isCreating} size="sm">
                        Limpar
                    </Button>

                    <Button onClick={handleSave} loading={isCreating} disabled={!canSave}>
                        Salvar conta
                    </Button>
                </div>
            </div>
        </div>
    );
}
